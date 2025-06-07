"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Like({ post }: { post: postWithAuthor }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // State to track likes and if the user has liked the post
  const [likes, setLikes] = useState<number>(post.likes ?? 0);
  const [userLiked, setUserLiked] = useState<boolean>(post.user_liked_post ?? false);

  // Optimistic UI update
  const handleLikes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newUserLiked = !userLiked;
    const newLikes = newUserLiked ? likes + 1 : likes - 1;

    // Update UI instantly
    setUserLiked(newUserLiked);
    setLikes(newLikes);

    try {
      if (newUserLiked) {
        await supabase.from("Likes").insert({ user_id: user.id, post_id: post.id });
      } else {
        await supabase.from("Likes").delete().match({ user_id: user.id, post_id: post.id });
      }

      // Update the Blogs table
      await supabase.from("Blogs").update({ likes: newLikes }).eq("id", post.id);
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert UI if request fails
      setUserLiked(!newUserLiked);
      setLikes(likes);
    }
  };

  // Real-time listener for likes
  useEffect(() => {
    const channel = supabase
      .channel("realtime likes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Likes",
          filter: `post_id=eq.${post.id}`,
        },
        async () => {
          // Fetch latest likes count when changes occur
          const { data, error } = await supabase
            .from("Blogs")
            .select("likes")
            .eq("id", post.id)
            .single();

          if (!error && data?.likes !== undefined) {
            setLikes(data.likes ?? 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, post.id]);

  return (
    <button onClick={handleLikes} className="flex items-center group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${userLiked ? "fill-red-600 stroke-red-600" : "fill-none stroke-gray-400"
          } group-hover:fill-red-600 group-hover:stroke-red-600`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span className={`ml-2 text-lg ${userLiked ? "text-red-600" : "text-gray-400"} group-hover:text-red-600`}>
        {likes}
      </span>
    </button>
  );
}