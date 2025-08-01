"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import "@/styles/Banner/sidebar.css"

interface Props {
  ShowPopularPosts?: (isSelected: boolean) => void;
  loggedInUsername: string;
}

export default function SideBar({ ShowPopularPosts, loggedInUsername }: Props) {
  const [isFeedSelected, setFeedSelected] = useState(true);
  const [isPopularSelected, setPopularSelected] = useState(false);
  const [followingArray, setFollowingArray] = useState<string[]>([]);

  const getFollowingArray = async () => {

    const res = await fetch("/api/following");

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    setFollowingArray(data.following);
  }

  useEffect(() => {
    getFollowingArray();
  }, [])

  if (ShowPopularPosts) {

    return (
      <>
        <section>
          <ul className="nav-options">
            <li
              className={`nav-option ${isFeedSelected && "option-selected"}`}
              onClick={() => {
                setFeedSelected(true);
                setPopularSelected(false);
                ShowPopularPosts(false);
              }
              }>
              Feed
            </li>
            <li
              className={`nav-option ${isPopularSelected && "option-selected"}`}
              onClick={() => {
                setFeedSelected(false);
                setPopularSelected(true);
                ShowPopularPosts(true);
              }
              }>
              Popular
            </li>
            <li className="nav-option">
              <Link href="/snips">
                Snips
              </Link>
            </li>
            <li className="nav-option">
              <Link href={`/user/${loggedInUsername}`}>
                Profile
              </Link>
            </li>
            <li className="nav-option">
              <Link href="/settings/profile">
                Settings
              </Link>
            </li>
          </ul>
        </section>
        <section className="grid gap-y-7">
          <h1 className="header">Following</h1>
          <ul>
            {followingArray.length > 0 ? (
              followingArray.map((username: string, index: number) => (
                <a href={`/user/${username}`} key={index}>
                  <li className="flex items-center">
                    <Image
                      src="/icons/profile-icon.svg"
                      alt="This profile pic"
                      width={75}
                      height={75}
                    />
                    <span>{username}</span>
                  </li>
                </a>
              ))
            ) : (
              <p>You’re not following anyone.</p>
            )}
          </ul>
        </section>
      </>
    )
  } else {
    return (
      <>
        <section>
          <ul className="nav-options">
            <li
              className="nav-option"
            >
              <Link href={"/"}>
                Home
              </Link>
            </li>
            <li className="nav-option">
              <Link href={`/user/${loggedInUsername}`}>
                Profile
              </Link>
            </li>
            <li className="nav-option">
              <Link href={"/settings/profile"}>
                Settings
              </Link>
            </li>
          </ul>
        </section>
        <section className="grid gap-y-7">
          <h1 className="header">Following</h1>
          <ul>
            {followingArray.length > 0 ? (
              followingArray.map((username: string, index: number) => (
                <a href={`/user/${username}`} key={index}>
                  <li className="flex items-center">
                    <Image
                      src="/icons/profile-icon.svg"
                      alt="This profile pic"
                      width={75}
                      height={75}
                    />
                    <span>{username}</span>
                  </li>
                </a>
              ))
            ) : (
              <p>You’re not following anyone.</p>
            )}
          </ul>
        </section>
      </>
    )
  }
}