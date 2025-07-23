"use client";

import Link from "next/link";
import Image from "next/image";

import Comment from "@/components/Post/CommentBar";

import "@/styles/PostPage/commentSection.css";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type Comment = {
  id: number;
  content: string;
  created_at: string;
  profile: {
    username: string;
  };
}

/* eslint-disable max-len */
/**
 * This is the comment section component that renders the CommentBar component and the comments
 *
 * @param {string} post - the id of which the comment section belong to, used by CommentBar component
 *
 * @returns JSX.Element
 */
/* eslint-enable max-len */
export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>();

  const fetchComments = async () => {
    const res = await fetch(`/api/posts/${postId}/comments`);
    const data = await res.json();

    setComments(data);
  }

  useEffect(() => {
    fetchComments();
  }, []);

  /* eslint-disable max-len */
  return (
    <>
      <section>
        <Comment postId={postId} onNewComment={fetchComments} />
      </section>
      <section>
        {comments?.map((comment) => (
          <div key={comment.id} className="flex mt-5 items-center">
            <section>
              <Image
                src="/icons/profile-icon.svg"
                alt="user avatar"
                width={100}
                height={100}
                className="border-solid border-2 border-gray-400 rounded-full"
              />
            </section>
            <section className="ml-3 w-1/2">
              <p className="font-anonymous mb-3 hover:underline w-fit">
                <Link href={`/user/${comment.profile?.username}`}>
                  {comment.profile?.username}
                </Link>
              </p>
              <p className="font-inter">{comment.content}</p>
            </section>
          </div>
        ))}
      </section>
    </>
  );
}
