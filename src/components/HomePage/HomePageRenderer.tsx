"use client";

import { useState } from "react";

import SideBar from "@/components/Banners/SideBar";

import "@/styles/HomePage/postStyle.css"
import PostDisplayFunction from "./PostDisplayRenderer";
import UserOrganicFeed from "./OrganicFeedGenerator";

interface HomePageProps {
  popularPosts: postWithAuthor[];
  loggedInUsername: string;
}

export default function HomePage({ popularPosts, loggedInUsername }: HomePageProps) { // eslint-disable-line max-len

  const [isPopularSelected, setIsPopularSelected] = useState(false);

  const displayPopular = (isPopularSelected: boolean) => {
    setIsPopularSelected(isPopularSelected)
  }

  /* eslint-disable */
  return (
    <div className="my-8">
      <nav className="sidebar">
        <SideBar
          ShowPopularPosts={displayPopular}
          loggedInUsername={loggedInUsername}
        />
      </nav>
      <div className="posts-wrapper">
        <section className="posts">
          {isPopularSelected ? <PostDisplayFunction posts={popularPosts} /> : <UserOrganicFeed />}
        </section>
      </div>
    </div>
  )
  /* eslint-enable */
}