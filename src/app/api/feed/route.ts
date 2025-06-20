import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createRouteHandlerClient<Database>({ cookies });

  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const feedPage = parseInt(pageParam ?? "1", 10);
  const postLimit = parseInt(limitParam ?? "10", 10);

  const startPoint = (feedPage - 1) * postLimit;
  const endPoint = startPoint + postLimit - 1;

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized", status: 401 });
  }

  const {
    data: profileData
  } = await supabase
    .from("profiles")
    .select("following")
    .eq("id", user.id)
    .single();

  const followees = profileData?.following ?? [];

  if (followees.length == 0) {
    NextResponse.json({ posts: [] })
  }

  const {
    data: postData
  } = await supabase
    .from("Blogs")
    .select("*, author: profiles(username, description)")
    .in("author", followees)
    .order("created_at", { ascending: false })
    .range(startPoint, endPoint);

  return NextResponse.json({ posts: postData })
}