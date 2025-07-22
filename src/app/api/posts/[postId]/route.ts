import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  const BLOG_FIELD = "id, content, title, likes, author: profiles(username, description), Likes(user_id)"
  const { data } = await supabase
    .from("Blogs")
    .select(BLOG_FIELD)
    .filter("id", "eq", params.postId)

  const postInfo =
    data?.map((post) => ({
      ...post,
      user_liked_post: post.Likes.some(
        (like) => like.user_id === user?.id
      ),
    })) ?? [];

  return NextResponse.json({ post: postInfo[0] })
}