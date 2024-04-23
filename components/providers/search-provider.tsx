"use client"
import React, { createContext, useState } from "react";


interface SearchResult {
  id: string;
  name?: string;
  content?: string;
  type: "User" | "Server" | "Channel" | "Message";
}

interface SearchContextValue {
  searchTerm: string;
  searchResults: SearchResult[];
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
}

export const SearchContext = createContext<SearchContextValue>({
  searchTerm: "",
  searchResults: [],
  setSearchTerm: () => {},
  setSearchResults: () => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const value: SearchContextValue = {
    searchTerm,
    searchResults,
    setSearchTerm,
    setSearchResults,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};