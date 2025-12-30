import NotePreviewClient from "./NotePreview.client";

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <NotePreviewClient id={params.id} />;
}
