"use client";

import { useRouter } from "next/navigation";

// importing stylesheet
import "@/styles/searchResultPage.css";

export const dynamic = "force-dynamic";

/**
 * The search result page done by user
 */
export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const router = useRouter();

  const query = searchParams.q;

  const res = await fetch(`/api/posts/search?q=${encodeURIComponent(String(query))}`)
  const posts: postWithAuthor[] = await res.json();

  if (posts) {
    return (
      <div className="m-12 flex flex-col items-center">
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
      </div>
    );
  }
}
