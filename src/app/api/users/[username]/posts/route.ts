import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data } = await supabase
    .from("Blogs")
    .select("id, title, content")
    .eq("author", params.username)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    blogs: data
  })
}