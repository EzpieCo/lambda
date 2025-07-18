"use client"

// importing necessary libraries
import { Suspense } from "react";

// importing the DisplayPost component
import SearchPosts from "./SearchResultPosts";

// importing stylesheet
import "@/styles/searchResultPage.css";

// Tell's vercel that this is a dynamic function
export const dynamic = "force-dynamic";

/**
 * The search result page done by user
 *
 * @param {string} params.query - the search query of the user
 *
 * @returns JSX.Element
 */
export default async function Page({ params }: { params: { query: string } }) {
  // format the query to replace spaces(" ") with dashes("-")
  const formattedQuery = params.query.replace(/-/g, " ");

  const res = await fetch(`/api/posts/search?q=${encodeURIComponent(formattedQuery)}`, {
    cache: "no-store"
  })

  const posts = await res.json();

  if (posts) {
    return (
      <div className="m-12 flex flex-col items-center">
        <Suspense fallback={<p>Loading posts...</p>}>
          <SearchPosts posts={posts} />
        </Suspense>
      </div>
    );
  }
}
