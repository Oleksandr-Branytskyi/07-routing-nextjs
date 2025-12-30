import type { ReactNode } from "react";
import LayoutNotes from "@/components/LayoutNotes/LayoutNotes";

type Props = {
  children: ReactNode;
  sidebar?: ReactNode;
  notes?: ReactNode;
  modal?: ReactNode;
};

export default function Layout({ sidebar, notes, modal }: Props) {
  return (
    <LayoutNotes
      sidebar={sidebar ?? null}
      notes={notes ?? null}
      modal={modal ?? null}
    />
  );
}
