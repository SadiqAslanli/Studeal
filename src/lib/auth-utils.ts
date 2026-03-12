import { createClient } from "./supabase/server";
import { cache } from "react";

export type ProfileRow = { 
    id: string; 
    email: string | null; 
    full_name: string | null; 
    role: string | null; 
    image_url?: string | null;
    metadata?: any;
};

export const getServerProfile = cache(async () => {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, full_name, role, metadata, image_url')
            .eq('id', user.id)
            .maybeSingle();

        if (!profile) return null;

        return profile as ProfileRow;
    } catch (e) {
        return null;
    }
});
