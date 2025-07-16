import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createRouteHandlerClient<Database>({ cookies });

  const { data: snipsData, error } = await supabase
    .from("snips")
    .select("content, created_at, id, author: profiles(username)");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const sortedPost = snipsData ? snipsData.sort((a, b) => new Date(b.
    created_at).getTime() - new Date(a.created_at).getTime()) : [];

  return NextResponse.json(sortedPost);
}

interface ReqProp {
  userID: string,
  content: string,
}

export async function POST(req: NextRequest) {
  const supabase = await createRouteHandlerClient<Database>({ cookies });

  const { userID, content }: ReqProp = await req.json();

  if (!userID || !content) {
    return NextResponse.json(
      { error: "No userID or content provided" },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from("snips")
    .insert({
      author_id: userID,
      content: content
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });

}