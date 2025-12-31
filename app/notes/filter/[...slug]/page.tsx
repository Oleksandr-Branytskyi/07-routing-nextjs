import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { NoteTag } from "@/types/note";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const rawTag = slug?.[0] ?? "all";
  const tag: NoteTag | undefined =
    rawTag !== "all" ? (rawTag as NoteTag) : undefined;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { tag, page: 1, search: "" }],
    queryFn: () => fetchNotes({ page: 1, perPage: 20, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient slug={slug} />
    </HydrationBoundary>
  );
}
