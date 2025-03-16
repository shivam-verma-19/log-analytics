import { createClient } from "@supabase/supabase-js";

console.log("🚀 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("🔑 Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("🚨 Supabase environment variables are missing!");
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default supabase;
