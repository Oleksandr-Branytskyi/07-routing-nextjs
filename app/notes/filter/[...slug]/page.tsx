"use client";

import { useQuery } from "@tanstack/react-query";
import type { NoteTag } from "@/types/note";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
  params: { slug?: string[] };
};

export default function Page({ params }: Props) {
  const raw = params.slug?.[0];
  const tag = raw && raw !== "all" ? (raw as NoteTag) : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { tag }],
    queryFn: () => fetchNotes({ page: 1, perPage: 20, tag }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return <NoteList notes={data?.notes ?? []} />;
}
