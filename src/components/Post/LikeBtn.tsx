"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Like({ post }: { post: postWithAuthor }) {
  const supabase = createClientComponentClient<Database>();

  // State to track likes and if the user has liked the post
  const [likes, setLikes] = useState<number>(post.likes ?? 0);
  const [userLiked, setUserLiked] = useState<boolean>(post.user_liked_post ?? false);

  const handleLikes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newUserLiked = !userLiked;
    const newLikes = newUserLiked ? likes + 1 : likes - 1;

    const req = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id, liked: newUserLiked })
    })

    if (!req.ok) {
      throw new Error("Failed to update");
    }

    // Update UI instantly
    setUserLiked(newUserLiked);
    setLikes(newLikes);
  };

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