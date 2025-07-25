import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  const { data: followingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", params.username)
    .single();

  // prevent user from following themselves
  // if (user?.id == followingUser?.id) {
  //   return NextResponse.json(
  //     { message: "Can't follow yourself", success: false },
  //     { status: 400 }
  //   );
  // }

  const { error } = await supabase
    .from("follows")
    .insert({
      follower_id: String(user?.id),
      following_id: String(followingUser?.id),
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const supabase = await createRouteHandlerClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "You are not logged in" },
      { status: 401 }
    );
  }

  const { data: followingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", params.username)
    .single();

  const { data, error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", "c21f3255-f0a7-481c-b3f6-ef4cc9eedcc6")
    .eq("following_id", "c21f3255-f0a7-481c-b3f6-ef4cc9eedcc6");

  console.log(data);
  console.log(error);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 })
}