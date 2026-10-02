"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInResult = { success: true } | { success: false; error: string };

export async function signIn(email: string, password: string): Promise<SignInResult> {
  if (!email || !password) {
    return { success: false, error: "Please enter your email and password." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: "Invalid email or password." };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
