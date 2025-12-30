"use client";
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

export default function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { tag: undefined }],
    queryFn: () => fetchNotes({ page: 1, perPage: 20 }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return <NoteList notes={data?.notes ?? []} />;
}
