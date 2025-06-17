import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const { postId, liked } = await req.json();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized", status: 401 });
  }

  if (liked) {
    await supabase
      .from("Likes")
      .insert({ user_id: user.id, post_id: postId });
  } else {
    await supabase
      .from("Likes")
      .delete()
      .match({ user_id: user.id, post_id: postId });
  }

  return NextResponse.json({ success: true });

}