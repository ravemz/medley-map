import React, { ReactNode } from "react";
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import Fuse from "fuse.js";
import { Room, Config } from "./config.types";
import { useTranslations } from "next-intl";

interface RoomSelectProps {
  config: Config;
  onRoomSelected?: (room: Room) => void;
}

export default function RoomSelect({
  config,
  onRoomSelected,
}: RoomSelectProps) {
  const t = useTranslations("room-select");
  const [focused, setFocused] = React.useState(false);
  const onFocus = () => setFocused(true);
  const onDismiss = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget || e.currentTarget.tagName === "BUTTON") {
      setFocused(false);
    }
  };
  const [query, setQuery] = React.useState("");

  const onRoomClick = (room: Room) => {
    setFocused(false);
    setQuery("");
    onRoomSelected && onRoomSelected(room);
  };

  // Helper function to highlight matched text, accounting for hyphens
  const highlightMatch = (text: string, query: string): ReactNode => {
    if (!query) return text;
    
    // For regular exact matches, use the standard approach
    const exactIndex = text.toLowerCase().indexOf(query.toLowerCase());
    if (exactIndex !== -1) {
      const before = text.substring(0, exactIndex);
      const match = text.substring(exactIndex, exactIndex + query.length);
      const after = text.substring(exactIndex + query.length);
      
      return (
        <>
          {before}
          <span className="bg-highlight font-semibold">{match}</span>
          {after}
        </>
      );
    }
    
    // For matches that might involve hyphens, we need a more complex approach
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    const textWithoutHyphens = removeHyphens(textLower);
    const queryWithoutHyphens = removeHyphens(queryLower);
    
    // Find the match in the hyphen-free versions
    const hyphenFreeIndex = textWithoutHyphens.indexOf(queryWithoutHyphens);
    if (hyphenFreeIndex === -1) return text;
    
    // Map the hyphen-free index back to the original text
    let originalStartIndex = -1;
    let originalEndIndex = -1;
    let hyphenFreePos = 0;
    
    // Find the start position in the original text
    for (let i = 0; i < textLower.length; i++) {
      if (textLower[i] !== '-') {
        if (hyphenFreePos === hyphenFreeIndex) {
          originalStartIndex = i;
          break;
        }
        hyphenFreePos++;
      }
    }
    
    // Find the end position in the original text
    hyphenFreePos = 0;
    for (let i = 0; i < textLower.length; i++) {
      if (textLower[i] !== '-') {
        hyphenFreePos++;
      }
      if (hyphenFreePos === hyphenFreeIndex + queryWithoutHyphens.length) {
        originalEndIndex = i + 1; // +1 to include the current character
        break;
      }
    }
    
    if (originalStartIndex === -1 || originalEndIndex === -1) return text;
    
    const before = text.substring(0, originalStartIndex);
    const match = text.substring(originalStartIndex, originalEndIndex);
    const after = text.substring(originalEndIndex);
    
    return (
      <>
        {before}
        <span className="bg-highlight font-semibold">{match}</span>
        {after}
      </>
    );
  };

  // Helper function to remove hyphens for comparison
  const removeHyphens = (text: string): string => {
    return text.replace(/-/g, '');
  };

  let results;
  if (query === "") {
    // Sort rooms alphabetically and then reverse the order
    results = config.map.rooms.sort((a, b) => a.label.localeCompare(b.label)).reverse();
  } else {
    // Use substring matching that activates from the first character
    // Remove hyphens from query for comparison
    const queryLower = query.toLowerCase();
    const queryWithoutHyphens = removeHyphens(queryLower);
    
    results = config.map.rooms.filter((room) => {
      // Check if room label contains the query as a substring (ignoring hyphens)
      if (removeHyphens(room.label.toLowerCase()).includes(queryWithoutHyphens)) {
        return true;
      }
      
      // Check if any room alias contains the query as a substring (ignoring hyphens)
      if (room.aliases && room.aliases.some(alias => 
        removeHyphens(alias.toLowerCase()).includes(queryWithoutHyphens)
      )) {
        return true;
      }
      
      return false;
    });
  }

  let icon;
  if (focused) {
    icon = (
      <button
        className="absolute left-6 top-3 cursor-pointer pb-2 pl-1 pr-2 pt-2 text-primary-text"
        tabIndex={1}
        onClick={onDismiss}
      >
        <ChevronLeftIcon className="size-6" />
      </button>
    );
  } else {
    icon = (
      <MagnifyingGlassIcon className="absolute left-6 top-3 size-10 pb-2 pl-1 pr-2 pt-2 text-primary-text" />
    );
  }

  return (
    <div
      className={`absolute top-0 left-0 z-50 w-3/4 max-w-md transition ${focused ? "bg-transparent" : "bg-transparent"}`}
      onFocus={onFocus}
      onClick={onDismiss}
    >
      <div className="px-4 py-2">
        <input
          className="w-full rounded-full border-2 border-border bg-background p-3 pl-14 text-lg text-primary-text placeholder-secondary-text shadow-md focus:border-accent focus:outline-none transition-all"
          tabIndex={2}
          type="text"
          placeholder={t("search-placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {icon}
      </div>
      {focused && results.length > 0 && (
        <div className="relative px-4">
          <ul
            className="mt-2 rounded-lg bg-background shadow-lg overflow-hidden border border-border"
          >
            {results.slice(0, 3).map((room, i) => {
              return (
                <li key={room.id}>
              <a
                className="block cursor-pointer border-b-2 border-border p-2 hover:bg-highlight-background"
                href={`/room/${room.id}`}
                tabIndex={i + 3}
                onClick={(e) => {
                  e.preventDefault();
                  onRoomClick(room);
                }}
              >
                <p>{highlightMatch(room.label, query)}</p>
                {room.aliases && (
                  <p className="text-secondary-text">
                    {room.aliases.map((alias, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && ", "}
                        {highlightMatch(alias, query)}
                      </React.Fragment>
                    ))}
                  </p>
                )}
              </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
