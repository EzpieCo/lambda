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