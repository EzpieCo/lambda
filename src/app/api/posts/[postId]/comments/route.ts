import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const COMMENT_FILED = "id, content, created_at, post_id, profiles(username)";
  const { data: comments, error } = await supabase
    .from("comments")
    .select(COMMENT_FILED)
    .eq("post_id", params.postId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(comments);

}

export async function POST(req: NextRequest) {
  const supabase = await createRouteHandlerClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { postId, commentContent } = await req.json();

  const { error } = await supabase
    .from("comments")
    .insert({
      user_id: String(user?.id),
      post_id: postId,
      content: commentContent
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });

}