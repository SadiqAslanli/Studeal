import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET — fetch ilə çağırılır, server cookie-ləri silir, 200 qaytarır
export async function GET() {
    const supabase = await createClient();

    // Server tərəfdən çıxış — httpOnly cookie-lər burada silinir
    await supabase.auth.signOut();

    return NextResponse.json({ success: true }, { status: 200 });
}

// POST — alternativ metod üçün
export async function POST() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    return NextResponse.json({ success: true }, { status: 200 });
}
