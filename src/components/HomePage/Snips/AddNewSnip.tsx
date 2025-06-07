'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function AddNewSnip({ userID }: { userID: string }) {
  const [snipContent, setSnipContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClientComponentClient<Database>();

  const postNewSnip = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("snips")
      .insert({
        author_id: userID,
        content: snipContent
      })

    if (!error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel("realtime Snips")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "snips",
        },
        (payload) => {
          console.log({ payload });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }

  }, []);

  return (
    <div className="add-snip-field-wrapper">
      <div className="flex flex-col w-1/2 new-snip-container">
        <textarea
          className="w-full focus:outline-none"
          placeholder="what's cooking?"
          value={snipContent}
          onChange={(e) => setSnipContent(e.target.value)}
          rows={3}
        />
        <button
          className="self-end post-btn"
          onClick={postNewSnip}
          disabled={isLoading}
        >
          {isLoading ? "Posting" : "Post"}
        </button>
      </div>
    </div>
  )
}