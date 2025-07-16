import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createRouteHandlerClient<Database>({ cookies });

  const { data: user, error } = await supabase.auth.getUser();

  if (!user || error) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the username from the profiles table
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.user.id) // weird supabase things
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: user.user.id, // weird supabase things
    username: profileData.username,
  });

}