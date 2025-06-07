"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { SkeletonPostLoader } from "./HomePageSkeletonUI";

// Dynamically import PostDisplayFunction
const PostDisplayFunction = dynamic(() => import("./PostDisplayRenderer"));

export default function UserOrganicFeed() {
  const [followingUsersPosts, setFollowingUsersPosts] = useState<postWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedData = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClientComponentClient<Database>();

        // Get logged-in user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setError("Failed to get user data.");
          return;
        }

        const loggedInUserId = userData.user.id;

        // Get the list of users the logged-in user is following
        const { data: followingData, error: followingError } = await supabase
          .from("profiles")
          .select("following")
          .eq("id", String(loggedInUserId))
          .single();

        if (followingError) {
          setError("Task failed successfully!");
          return;
        }

        const followingList = followingData?.following ?? [];
        if (followingList.length === 0) {
          setFollowingUsersPosts([]);
          setLoading(false);
          return;
        }

        // Fetch posts from all followed users in parallel
        const { data: postsData, error: postsError } = await supabase
          .from("Blogs")
          .select("*, author: profiles(*)")
          .in("author", followingList);

        if (postsError) {
          setError("Failed to fetch posts.");
          return;
        }

        // Sort posts from newest to oldest
        const sortedPosts = postsData
          ? postsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          : [];

        setFollowingUsersPosts(sortedPosts);
      } catch (err) {
        setError("Something went wrong while fetching the feed.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  return (
    <Suspense fallback={<p>Building Feed... Please wait</p>}>
      {loading ? (
        <SkeletonPostLoader />
      ) : error ? (
        <p>{error}</p>
      ) : followingUsersPosts.length > 0 ? (
        <PostDisplayFunction posts={followingUsersPosts} />
      ) : (
        <p>You are not following anyone.</p>
      )}
    </Suspense>
  );
}
