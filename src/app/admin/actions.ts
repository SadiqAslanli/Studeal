"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type CompanyProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  is_active: boolean | null;
  category_id: number | null;
};

import { unstable_noStore as noStore } from "next/cache";

export async function listCompanies() {
  noStore();
  const supabase = createAdminClient();
  
  // Attempt with all columns, but without ordering by potentially missing 'created_at'
  const { data, error } = await supabase
    .from("profiles")
    .select("*"); // Select all to see what we actually have

  if (error) {
    console.error("DEBUG: listCompanies error:", error);
    return [];
  }

  if (data) {
    console.log("DEBUG: Total profiles found:", data.length);
    // Log available columns on the first record
    if (data.length > 0) {
      console.log("DEBUG: Available columns:", Object.keys(data[0]));
    }
  }

  // Filter for role 'Company' case-insensitively
  const companies = data?.filter(p => p.role?.toLowerCase() === "company") || [];
  
  return (companies as CompanyProfile[]);
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

export async function createCompanyUser(name: string, email: string, password: string, categoryId: number): Promise<CreateCompanyResult> {
  try {
    const supabase = createAdminClient();
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log("DEBUG: Creating auth user for", normalizedEmail);
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: name.trim() },
    });

    if (createError) {
      console.error("DEBUG: Auth user creation failed:", createError.message);
      return { ok: false, error: createError.message };
    }
    
    if (!userData.user) {
      return { ok: false, error: "User creation failed" };
    }

    const userId = userData.user.id;
    console.log("DEBUG: Auth user created with ID:", userId);

    // Prepare profile data
    const profileData: any = {
      id: userId,
      email: normalizedEmail,
      role: "Company",
      full_name: name.trim(),
      is_active: true,
      updated_at: new Date().toISOString()
    };

    // Try to include category_id, but we'll try to catch if the column is missing
    console.log("DEBUG: Upserting profile for", userId);
    
    // Attempt upsert with all fields first
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({ ...profileData, category_id: categoryId });

      if (updateError) {
        console.warn("DEBUG: Initial profile upsert failed, retrying without category_id:", updateError.message);
        // Retry without category_id in case the column doesn't exist yet
        const { error: retryError } = await supabase
          .from("profiles")
          .upsert(profileData);
          
        if (retryError) {
          console.error("DEBUG: Profile retry upsert failed:", retryError.message);
          return { ok: false, error: "Profil yaradıla bilmədi: " + retryError.message };
        }
      }
    } catch (upsertEx) {
      console.error("DEBUG: Profile upsert exception:", upsertEx);
      return { ok: false, error: "Sistem xətası: " + (upsertEx instanceof Error ? upsertEx.message : "Upsert failed") };
    }

    console.log("DEBUG: Company creation successful for", normalizedEmail);
    return { ok: true };
  } catch (e) {
    console.error("DEBUG: createCompanyUser unexpected exception:", e);
    const message = e instanceof Error ? e.message : "Failed to create company";
    return { ok: false, error: message };
  }
}
