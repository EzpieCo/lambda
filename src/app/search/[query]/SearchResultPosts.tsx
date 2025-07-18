"use client";

import { useRouter } from "next/navigation";

export default function SearchPosts({ posts }: { posts: postWithAuthor[] }) {

  const router = useRouter();

  return (
    <>
      {posts.map((post) => (
        <div className="w-1/2" key={post.id}>
          <div
            className="post-wrapper"
            onClick={() => router.push(`/post/${post.id}`)}
          >
            <p
              className="post-author text-sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/user/${post.author?.username}`);
              }}
            >
              {post.author?.username}
            </p>
            <p className="post-title">
              {post.title}
            </p>
            <p className="line-clamp-2 post-content">
              {post.content}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
