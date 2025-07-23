"use client";

import Link from "next/link";

import Like from "@/components/Post/LikeBtn";
import Formatter from "@/components/Post/MarkupFormatter";
import SideBar from "@/components/Banners/SideBar";

import "@/styles/PostPage/PostPage.css";
import { useEffect, useState } from "react";

interface Props {
  postId: string;
}

export default function PostRenderer({ postId }: Props) {

  const [postInfo, setPostInfo] = useState<postWithAuthor>();
  const [username, setUsername] = useState();

  const fetchPost = async () => {
    const res = await fetch(`/api/posts/${postId}`)
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

  if (postInfo) {
    return (
      <>
        <nav className="sidebar">
          <SideBar
            loggedInUsername={String(username)}
          />
        </nav>
        <section className="post p-5">
          <div className="mb-10">
            <h1 className="font-anonymous mb-8 text-2xl font-extrabold">
              {postInfo.title}
            </h1>
            <div className="post-content">
              {postInfo.content && <Formatter postContent={postInfo.content} />}
            </div>
          </div>
          <div>
            <Like post={postInfo} />
          </div>
        </section>
        <section className="w-80">
          <p>
            <Link
              href={`/user/${postInfo.author?.username}`}
              className="font-anonymous hover:underline"
            >
              {postInfo.author?.username}
            </Link>
          </p>
          <p className="font-inter text-sm text-neural-300">
            {postInfo.author?.description}
          </p>
        </section>
      </>
    )
  }
}