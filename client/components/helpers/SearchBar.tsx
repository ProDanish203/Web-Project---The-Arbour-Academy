"use client";
import { Search } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";

export const SearchBar = () => {
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  // const isDesktop = useMediaQuery("(min-width: 640px)");

  const query = useDebounce(search, 700);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const currentQuery = searchParams.get("search") || "";

    // Reset page to 1 only when the search query changes
    if (query !== currentQuery) {
      router.push(`${pathname}?${createQueryString("search", query)}`);
    }
  }, [query, router, pathname, searchParams, createQueryString]);

  return (
    <div className="relative bg-neutral-100 w-fit px-3 py-2 rounded-md flex items-center gap-x-1">
      <input
        type="text"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        className="outline-none text-sm bg-transparent"
        placeholder="Search..."
      />
      <button>
        <Search className="size-4" />
      </button>
    </div>
  );
};
