import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createRouteHandlerClient<Database>({ cookies })

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized", status: 401 });
  }

  const { data } = await supabase
    .from("profiles")
    .select("following")
    .eq("id", user.id)
    .single();

  return NextResponse.json({ following: data?.following ?? [] });
}