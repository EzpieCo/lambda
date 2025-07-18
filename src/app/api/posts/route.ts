import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { error: "No Title or Content provided " },
      { status: 400 })
  }

  const supabase = await createRouteHandlerClient<Database>({ cookies });

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { data: author } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const { data: insertData, error: insertError } = await supabase
    .from("Blogs")
    .insert({
      user_id: user.id,
      author: author?.username,
      title: title,
      content: content,
      likes: 0
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  return NextResponse.json({ id: insertData.id }, { status: 201 });

}