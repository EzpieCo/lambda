"use client";

import { useRouter } from "next/router";
// Import necessary libraries and hooks
import React, { useState } from "react";

interface CommentInfo {
  postId: string;
}

/**
 * Comment Bar component is used for commenting on posts
 *
 * @param {string} postId - the id of the post which the new comment belongs to
 *
 * @returns JSX.Element
 */
export default function Comment({ postId }: CommentInfo) {
  const [commentContent, setCommentContent] = useState("");
  const router = useRouter();

  const handleComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postId, commentContent: commentContent })
    })

    const result = await res.json();

    if (result.success) {
      setCommentContent("");
      router.reload();
    }
  };


  /* eslint-disable max-len */
  return (
    <form
      className="flex flex-row gap-4 w-full"
      onSubmit={(event) => handleComment(event)}
    >
      <input
        type="text"
        placeholder="Comment..."
        className="shadow-xl rounded-md outline-none px-5 py-3 sm:w-1/2"
        onChange={(e) => setCommentContent(e.target.value)}
        value={commentContent}
      />
      <button type="submit" className="comment-btn">
        Comment
      </button>
    </form>
  );
}
