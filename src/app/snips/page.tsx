'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SideBar from "@/components/Banners/SideBar";
import SnipRenderer from "@/components/HomePage/Snips/SnipsRenderer";
import { SkeletonSnipLoader } from "@/components/HomePage/HomePageSkeletonUI";
import AddNewSnip from "@/components/HomePage/Snips/AddNewSnip";

export default function SnipsPage() {
  const [snipsData, setSnips] = useState<snipsWithAuthor[]>([]);
  const [loggedInUsername, setLoggedInUsername] = useState<string>("");
  const [loggedInUserID, setLoggedInUserID] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchSnips = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/users/me")
      const user = await res.json()

      setLoggedInUsername(user.username);
      setLoggedInUserID(user.id);

      const respond = await fetch("/api/snips")
      const snips = await respond.json();
      setSnips(snips);

    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  useEffect(() => {
    fetchSnips();
  }, []);

  return (
    <div className="homepage-wrapper mt-8">
      <nav className="sidebar">
        <SideBar
          loggedInUsername={loggedInUsername}
        />
      </nav>
      <AddNewSnip userID={loggedInUserID} onSnipPosted={fetchSnips} />
      {isLoading ? <SkeletonSnipLoader /> : <SnipRenderer snips={snipsData} />}
    </div>
  )

}