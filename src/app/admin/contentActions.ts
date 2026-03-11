"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Sidebar Ads
 */
export async function getSidebarAds() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('sidebar_ads').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching ads:", error);
        return [];
    }
    return data;
}

export async function addSidebarAd(imageUrl: string, discount: string, companyId?: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('sidebar_ads').insert({
        image_url: imageUrl,
        discount,
        company_id: companyId || null
    }).select().single();

    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true, data };
}

export async function deleteSidebarAd(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase.from('sidebar_ads').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true };
}

/**
 * Featured Deals (Slider)
 */
export async function getFeaturedDeals() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('featured_deals').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
}

export async function addFeaturedDeal(deal: { title: string; description: string; discount: string; image_url: string }) {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('featured_deals').insert(deal).select().single();
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true, data };
}

export async function deleteFeaturedDeal(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase.from('featured_deals').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true };
}

/**
 * Messages / Feedback
 */
export async function getMessages() {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
}

export async function addMessage(msg: { name: string; email: string; type: string; message: string }) {
    const supabase = await createClient();
    const { error } = await supabase.from('messages').insert(msg);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

export async function deleteMessage(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true };
}

/**
 * Ad Requests
 */
export async function getAdRequests() {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('ad_requests').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
}

export async function submitAdRequest(data: { 
    company_id?: string; 
    company_name: string; 
    image_url?: string;
    content?: string;
    phone?: string;
    email?: string;
}) {
    const supabase = await createClient();
    const { error } = await supabase.from('ad_requests').insert({
        company_id: data.company_id || null,
        company_name: data.company_name,
        image_url: data.image_url || null,
        status: 'pending',
        content: data.content || '',
        phone: data.phone || '',
        email: data.email || ''
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

export async function updateAdRequestStatus(id: string, status: 'approved' | 'rejected') {
    const supabase = createAdminClient();
    const { error } = await supabase.from('ad_requests').update({ status }).eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true };
}

export async function deleteAdRequest(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase.from('ad_requests').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true };
}
