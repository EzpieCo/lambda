'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import SideBar from "@/components/Banners/SideBar";
import SnipRenderer from "@/components/HomePage/Snips/SnipsRenderer";
import { SkeletonSnipLoader } from "@/components/HomePage/HomePageSkeletonUI";
import AddNewSnip from "@/components/HomePage/Snips/AddNewSnip";
import { useRouter } from "next/navigation";

export default function SnipsPage() {
  const [snipsData, setSnips] = useState<snipsWithAuthor[]>([]);
  const [loggedInUsername, setLoggedInUsername] = useState<string>("");
  const [loggedInUserID, setLoggedInUserID] = useState<string>("");
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const fetchSnipsData = async () => {
      setIsLoading(true);

      try {
        const { data: loggedInUser } = await supabase.auth.getUser();
        const userID = loggedInUser.user?.id
        const { data: loggedInUsername } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", String(userID))
          .single();

        setLoggedInUsername(String(loggedInUsername?.username));
        setLoggedInUserID(String(userID));

        const { data: postData } = await supabase
          .from("snips")
          .select("*, author: profiles(*)");

        const sortedPost = postData ? postData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : [];

        setSnips(sortedPost);

      } finally {
        setIsLoading(false);
        router.refresh();
      }
    }

    fetchSnipsData();
  }, []);

  return (
    <div className="homepage-wrapper mt-8">
      <nav className="sidebar">
        <SideBar
          loggedInUsername={loggedInUsername}
        />
      </nav>
      <AddNewSnip userID={loggedInUserID} />
      {isLoading ? <SkeletonSnipLoader /> : <SnipRenderer snips={snipsData} />}
    </div>
  )

}