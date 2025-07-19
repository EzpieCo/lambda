"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

/**
 * Search bar component for the app
 * @returns JSX.Element
 */
export default function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedQuery = query.split(" ").join("-")

    router.push(`/search?q=${encodeURIComponent(formattedQuery)}`);
  };

  return (
    <form className="search-bar" onSubmit={(event) => handleSearch(event)}>
      <input
        type="text"
        placeholder="Search..."
        className="search-field"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}
