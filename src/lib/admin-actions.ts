"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ADMIN_COOKIE = "zylane-admin";

export async function adminLogin(password: string): Promise<boolean> {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return true;
  }
  return false;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

// ===== Workers CRUD =====

export async function getWorkers() {
  const { data, error } = await supabaseAdmin
    .from("workers")
    .select("*, schedules(*)")
    .order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function createWorker(worker: {
  name: string;
  skills: string[];
  email: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("workers")
    .insert(worker)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateWorker(
  id: string,
  updates: { name?: string; skills?: string[]; email?: string; is_active?: boolean }
) {
  const { error } = await supabaseAdmin
    .from("workers")
    .update(updates)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setWorkerSchedule(
  workerId: string,
  schedules: { day_of_week: number; start_time: string; end_time: string }[]
) {
  // Delete existing schedules
  await supabaseAdmin.from("schedules").delete().eq("worker_id", workerId);
  // Insert new ones
  if (schedules.length > 0) {
    const { error } = await supabaseAdmin
      .from("schedules")
      .insert(schedules.map((s) => ({ ...s, worker_id: workerId })));
    if (error) throw new Error(error.message);
  }
}

// ===== Services CRUD =====

export async function getAdminServices() {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .order("category")
    .order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function createService(service: {
  name: string;
  category: string;
  duration_minutes: number;
  price_display: string;
}) {
  const { error } = await supabaseAdmin.from("services").insert(service);
  if (error) throw new Error(error.message);
}

export async function updateService(
  id: string,
  updates: { name?: string; category?: string; duration_minutes?: number; price_display?: string; is_active?: boolean }
) {
  const { error } = await supabaseAdmin.from("services").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
}

// ===== Bookings =====

export async function getAdminBookings(dateFrom?: string, dateTo?: string) {
  let query = supabaseAdmin
    .from("bookings")
    .select("*, workers(name), services(name)")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (dateFrom) query = query.gte("date", dateFrom);
  if (dateTo) query = query.lte("date", dateTo);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function cancelAdminBooking(bookingId: string) {
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
}
