"use client";

import UserOrganicFeed from "./OrganicFeedGenerator";
import PostDisplayFunction from "./PostDisplayRenderer";

// an interface for latest and popular posts types
interface Props {
  popularPosts: postWithAuthor[];
  isPopularSelected: boolean;
}

/**
 * Used for displaying all the posts in the Blogs table
 *
 * @param {postWithAuthor[]} popularPosts - All the posts in most liked to least liked
 *
 * @returns JSX.Element
 */
export default function Posts({ popularPosts, isPopularSelected }: Props) {

  /* eslint-disable max-len */
  return (
    <>
      <section className={"posts"}>
        {isPopularSelected ? <PostDisplayFunction posts={popularPosts} /> : <UserOrganicFeed />}
      </section>
    </>
  );
}