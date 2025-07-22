"use client";

import CommentSection from "@/components/Post/CommentSection";
import PostRenderer from "@/app/post/[postId]/PostPageRenderer";
import { useEffect, useState } from "react";

// Tell's vercel that this is a dynamic function
export const dynamic = "force-dynamic";

/**
 * Displays the selected posts
 *
 * @param {string} params.postId - the id of the post which is selected
 *
 * @returns JSX.Element
 */
export default function Page({ params }: { params: { postId: string } }) {
  const [postInfo, setPostInfo] = useState<postWithAuthor>();
  const [username, setUsername] = useState();

  const fetchPost = async () => {
    const res = await fetch(`/api/posts/${params.postId}`)
    const data = await res.json();
    setPostInfo(data.post)
  }

  const fetchUser = async () => {
    const res = await fetch("/api/users/me")
    const user = await res.json();
    setUsername(user.username)
  }

  useEffect(() => {
    fetchUser();
    fetchPost();
  }, [])

  /* eslint-disable max-len */
  return (
    <div>
      <section className="md:flex justify-between md:mx-2 mx-1 my-4 pb-10 post-divider">
        <PostRenderer post={postInfo} loggedInUsername={username} />
      </section>
      <section className="ml-[17rem]">
        <CommentSection postId={params.postId} />
      </section>
    </div>
  );
}
