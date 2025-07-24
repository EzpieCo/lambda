import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data } = await supabase
    .from("profiles")
    .select("description, followers")
    .eq("username", params.username)
    .single();

  return NextResponse.json({
    description: data?.description,
    followers: data?.followers,
  });
}