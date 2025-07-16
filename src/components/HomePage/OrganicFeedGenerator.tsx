"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SkeletonPostLoader } from "./HomePageSkeletonUI";
import { InfoBanner, WarnBanner } from "../UI/Banner";

import "@/styles/HomePage/LoadMoreBtn.css";

// Dynamically import PostDisplayFunction
const PostDisplayFunction = dynamic(() => import("./PostDisplayRenderer"));

export default function UserOrganicFeed() {
  const [followingUsersPosts, setFollowingUsersPosts] = useState<postWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedPage, setFeedPage] = useState(1);
  const [moreFeed, setMoreFeed] = useState(true);

  const fetchFeedData = async (pageNum: number) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/feed?page=${pageNum}&limit=50`);
      const data = await res.json();

      if (data.posts.length == 0) {
        setMoreFeed(false);
        return
      }

      setFollowingUsersPosts((prev) => [...prev, ...data.posts]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData(feedPage);
  }, []);

  const LoadMore = () => {
    setFeedPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchFeedData(nextPage);
      return nextPage;
    })

  }

  return (
    <>
      {loading ? (
        <SkeletonPostLoader />
      ) : followingUsersPosts.length > 0 ? (
        <>
          <PostDisplayFunction posts={followingUsersPosts} />
          {moreFeed && (
            <button
              type="button"
              onClick={LoadMore}
              className=" load-more-btn mx-auto block mt-4 px-6 py-2 rounded-lg"
            >
              Load More
            </button>
          )}
        </>
      ) : (
        <WarnBanner message="You are not following anyone" />
      )}

      {!moreFeed && followingUsersPosts.length > 0 && (
        <InfoBanner message="That's it for Today &#9749;" />
      )}
    </>
  );
}
