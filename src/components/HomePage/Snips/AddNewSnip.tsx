'use client';

import { useState } from "react";

interface Props {
  userID: string,
  onSnipPosted: () => void
}

export default function AddNewSnip({ userID, onSnipPosted }: Props) {
  const [snipContent, setSnipContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const postNewSnip = async () => {
    setIsLoading(true);

    const req = await fetch("/api/snips", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userID: userID,
        content: snipContent
      })
    })

    const result = await req.json();

    if (result.success) {
      setIsLoading(false);
      setSnipContent("");
      onSnipPosted();
    }
  }

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