"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";


export type CompanyProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  is_active: boolean | null;
  category_id: number | null;
  image_url?: string | null;
  metadata?: any;
};

export async function listCompanies() {
  noStore();
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "Company"); // Direct SQL filter for safety and performance

  if (error) {
    console.error("DEBUG: listCompanies error:", error);
    return [];
  }

  // Robust mapping with fallbacks
  const companies = (data || []).map(p => ({
    ...p,
    // Fallback if column is missing or null
    category_id: p.category_id ?? p.metadata?.category_id ?? 1
  }));

  return (companies as CompanyProfile[]);
}

export type CreateCompanyResult = { ok: true } | { ok: false; error: string };

export async function updateCompanyStatus(id: string, isActive: boolean): Promise<CreateCompanyResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("profiles").update({ is_active: isActive, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath('/admin');
    revalidatePath('/');
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

export async function createCompanyUser(name: string, email: string, password: string, categoryId: number, imageUrl?: string): Promise<CreateCompanyResult> {
  try {
    const supabase = createAdminClient();
    const normalizedEmail = email.trim().toLowerCase();
    
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: name.trim() },
    });

    if (createError) return { ok: false, error: createError.message };
    if (!userData.user) return { ok: false, error: "User creation failed" };

    const userId = userData.user.id;

    // Wait briefly for the DB trigger to create the profile row
    await new Promise(r => setTimeout(r, 600));

    const profileData: any = {
      id: userId,
      email: normalizedEmail,
      role: "Company",
      full_name: name.trim(),
      is_active: true,
      category_id: categoryId,
      image_url: imageUrl || null,
      metadata: { 
        image: imageUrl || null,
        category_id: categoryId // Backup storage in metadata
      },
      updated_at: new Date().toISOString()
    };

    // Use upsert directly to ensure the profile row is either created or updated with our data
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(profileData, { onConflict: 'id' });

    if (upsertError) {
      console.error("Profile upsert failed:", upsertError.message);
      // Return error to UI so we know why it's failing
      return { ok: false, error: "İstifadəçi yarandı, lakin profil məlumatları bazaya yazıla bilmədi: " + upsertError.message };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    console.error("createCompanyUser error:", e);
    return { ok: false, error: e instanceof Error ? e.message : "Xəta baş verdi" };
  }
}

export async function updateCompanyProfile(id: string, payload: any): Promise<CreateCompanyResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        ...payload,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/company/${id}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}
