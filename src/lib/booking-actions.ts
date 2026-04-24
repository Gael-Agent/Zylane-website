"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Service, Worker, Schedule, Booking, TimeSlot } from "@/lib/types";
import { sendBookingConfirmation } from "@/lib/email";

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function getAvailableSlots(
  serviceId: string,
  date: string // YYYY-MM-DD
): Promise<TimeSlot[]> {
  // 1. Get the service to know duration and category
  const { data: service, error: sErr } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();
  if (sErr || !service) return [];

  // 2. Determine which skill is needed
  // 'barbe' services can be done by workers with 'hommes' skill
  const skillNeeded = service.category === "barbe" ? "hommes" : service.category;

  // 3. Get active workers with the required skill
  const { data: workers, error: wErr } = await supabaseAdmin
    .from("workers")
    .select("*")
    .eq("is_active", true)
    .contains("skills", [skillNeeded]);
  if (wErr || !workers?.length) return [];

  const workerIds = workers.map((w: Worker) => w.id);

  // 4. Get schedules for this day of week
  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  const { data: schedules, error: schErr } = await supabaseAdmin
    .from("schedules")
    .select("*")
    .in("worker_id", workerIds)
    .eq("day_of_week", dayOfWeek);
  if (schErr || !schedules?.length) return [];

  // 5. Get existing confirmed bookings for this date for these workers
  const { data: bookings, error: bErr } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .in("worker_id", workerIds)
    .eq("date", date)
    .eq("status", "confirmed");
  const existingBookings: Booking[] = bErr ? [] : (bookings || []);

  // 6. Compute available slots per worker
  const duration = service.duration_minutes;
  const slots: TimeSlot[] = [];

  for (const schedule of schedules as Schedule[]) {
    const worker = workers.find((w: Worker) => w.id === schedule.worker_id);
    if (!worker) continue;

    const workerBookings = existingBookings.filter(
      (b) => b.worker_id === schedule.worker_id
    );

    // Generate slots in 30-min increments within schedule
    const startMinutes = timeToMinutes(schedule.start_time);
    const endMinutes = timeToMinutes(schedule.end_time);

    for (let t = startMinutes; t + duration <= endMinutes; t += 30) {
      const slotStart = minutesToTime(t);
      const slotEnd = minutesToTime(t + duration);

      // Check overlap with existing bookings
      const overlaps = workerBookings.some((b) => {
        const bStart = timeToMinutes(b.start_time);
        const bEnd = timeToMinutes(b.end_time);
        return t < bEnd && t + duration > bStart;
      });

      if (!overlaps) {
        slots.push({
          start: slotStart,
          end: slotEnd,
          worker_id: worker.id,
          worker_name: worker.name,
        });
      }
    }
  }

  // Sort by time, then deduplicate display (show earliest worker per time)
  slots.sort((a, b) => a.start.localeCompare(b.start));
  return slots;
}

export async function createBooking(data: {
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  workerId: string;
  clientName: string;
  clientContact: string;
}): Promise<{ success: boolean; error?: string }> {
  // Verify slot is still available (race condition guard)
  const { data: conflicts } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("worker_id", data.workerId)
    .eq("date", data.date)
    .eq("status", "confirmed")
    .lt("start_time", data.endTime)
    .gt("end_time", data.startTime);

  if (conflicts && conflicts.length > 0) {
    return { success: false, error: "Ce créneau vient d'être réservé. Veuillez en choisir un autre." };
  }

  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      worker_id: data.workerId,
      service_id: data.serviceId,
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      client_name: data.clientName,
      client_contact: data.clientContact,
    })
    .select("*, workers(name), services(name)")
    .single();

  if (error) {
    return { success: false, error: "Erreur lors de la réservation. Veuillez réessayer." };
  }

  // Send emails (non-blocking)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zylane-website.vercel.app";
  try {
    // Email to client (if contact looks like an email)
    if (data.clientContact.includes("@")) {
      await sendBookingConfirmation({
        to: data.clientContact,
        clientName: data.clientName,
        serviceName: (booking as any).services?.name || "",
        date: data.date,
        startTime: data.startTime,
        workerName: (booking as any).workers?.name || "",
        cancelUrl: `${siteUrl}/cancel/${booking.cancel_token}`,
      });
    }
  } catch {
    // Email failure shouldn't block the booking
  }

  return { success: true };
}

export async function cancelBooking(
  cancelToken: string
): Promise<{ success: boolean; error?: string }> {
  const { data: booking, error: fetchErr } = await supabaseAdmin
    .from("bookings")
    .select("*, services(name)")
    .eq("cancel_token", cancelToken)
    .eq("status", "confirmed")
    .single();

  if (fetchErr || !booking) {
    return { success: false, error: "Réservation introuvable ou déjà annulée." };
  }

  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("cancel_token", cancelToken);

  if (error) {
    return { success: false, error: "Erreur lors de l'annulation." };
  }

  return { success: true };
}

// Helpers
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}
