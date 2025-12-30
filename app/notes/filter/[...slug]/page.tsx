import NotesClient from "./Notes.client";

type Props = {
  params: { slug?: string[] };
};

export default function Page({ params }: Props) {
  return <NotesClient slug={params.slug} />;
}
