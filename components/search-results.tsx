/* eslint-disable react/no-unescaped-entities */
import { SearchService } from "@/lib/search-service";
import { notFound } from "next/navigation";
import React from "react";

interface SearchResult {
  id: string;
  name?: string;
  content?: string;
  type: "User" | "Server" | "Channel" | "Message";
}

interface SearchResultsProps {
  params: { term: string };
}

export default async function SearchResults({ params }: SearchResultsProps) {
  const { term } = params;
  const results: SearchResult[] = await SearchService.searchAll(term);

  if (!results || results.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">Search Results for "{term}"</h1>
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center"
        >
          <div className="flex-1">
            {result.type === "User" && (
              <>
                <h2 className="text-xl font-bold">User</h2>
                <p>{result.name}</p>
              </>
            )}
            {result.type === "Server" && (
              <>
                <h2 className="text-xl font-bold">Server</h2>
                <p>{result.name}</p>
              </>
            )}
            {result.type === "Channel" && (
              <>
                <h2 className="text-xl font-bold">Channel</h2>
                <p>{result.name}</p>
              </>
            )}
            {result.type === "Message" && (
              <>
                <h2 className="text-xl font-bold">Message</h2>
                <p>{result.content}</p>
              </>
            )}
          </div>
          <div className="ml-4 text-gray-500">{result.type}</div>
        </div>
      ))}
    </div>
  );
}