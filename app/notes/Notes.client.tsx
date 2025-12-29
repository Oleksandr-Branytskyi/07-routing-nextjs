"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./NotesPage.module.css";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import { fetchNotes } from "@/lib/api";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["notes", { page, search: debouncedSearch }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    placeholderData: (prev) => prev,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} type="button" onClick={openModal}>
          Create note +
        </button>
      </header>

      {isError && <p>Something went wrong. Please try again.</p>}

      {!isError && isFetching && notes.length === 0 && <p>Loading...</p>}

      {!isError && !isFetching && notes.length === 0 && <p>No notes found.</p>}

      {notes.length > 0 && <NoteList notes={notes} />}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm onCancel={closeModal} />
      </Modal>
    </div>
  );
}
