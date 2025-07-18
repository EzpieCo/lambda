import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = await createRouteHandlerClient<Database>({ cookies });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  const { data: searchResult, error } = await supabase
    .from("Blogs")
    .select("*, author: profiles(*)")
    .ilike("title", `%${query}%`)
    .order("created_at", { ascending: false });

  if (error || !searchResult) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(searchResult, { status: 200 });

}