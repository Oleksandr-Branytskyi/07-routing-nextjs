"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";

import type { NoteTag } from "@/types/note";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
  params: Promise<{ tag?: string[] }> | { tag?: string[] };
};

export default function Page({ params }: Props) {
  const resolvedParams = params instanceof Promise ? use(params) : params;

  const rawTag = resolvedParams.tag?.[0]; // "all" | "Work" | ...
  const tag = rawTag && rawTag !== "all" ? (rawTag as NoteTag) : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { tag }],
    queryFn: () => fetchNotes({ page: 1, perPage: 20, tag }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return <NoteList notes={data?.notes ?? []} />;
}
