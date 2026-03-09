"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type CompanyProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  is_active: boolean | null;
};

export async function listCompanies(): Promise<CompanyProfile[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active")
    .eq("role", "Company")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as CompanyProfile[];
}

export async function updateCompanyStatus(id: string, isActive: boolean): Promise<CreateCompanyResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("profiles").update({ is_active: isActive, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function deleteCompanyUser(id: string): Promise<CreateCompanyResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Delete failed" };
  }
}

export type CreateCompanyResult = { ok: true } | { ok: false; error: string };

export async function createCompanyUser(name: string, email: string, password: string): Promise<CreateCompanyResult> {
  try {
    const supabase = createAdminClient();
    const normalizedEmail = email.trim().toLowerCase();

    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: name.trim() },
    });

    if (createError) {
      return { ok: false, error: createError.message };
    }
    if (!userData.user) {
      return { ok: false, error: "User creation failed" };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: "Company", full_name: name.trim(), updated_at: new Date().toISOString() })
      .eq("id", userData.user.id);

    if (updateError) {
      return { ok: false, error: updateError.message };
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create company";
    return { ok: false, error: message };
  }
}
