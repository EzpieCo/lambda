"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const router = useRouter();

  const addPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: postTitle, content: postContent })
    });

    const result = await res.json();

    if (res.ok && result.id) {
      router.push(`/post/${result.id}`)
    } else {
      console.error("failed to create post: ", result.error);
    }
  };

  return (
    <div className="mt-10 mx-5">
      <form onSubmit={addPost}>
        <div className="post-form p-5 sm:w-[50vw] w-full">
          <p>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Post title..."
              className="meta-data mb-5 meta-data-title font-inter"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
          </p>

          <p>
            <textarea
              placeholder="Post content goes here..."
              name="content"
              id="content"
              className="meta-data meta-data-content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
          </p>
        </div>

        <button type="submit" className="post-btn" test-data="submitBtn">
          Post
        </button>
      </form>
    </div>
  );
}
