"use client";

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import type { NoteTag } from "@/types/note";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500, "Max 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: NoteFormValues) =>
      createNote({
        title: values.title.trim(),
        content: values.content.trim(),
        tag: values.tag,
      }),
    onSuccess: () => {
      // інвалідимо всі варіанти списку: з page/search
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  const handleSubmit = async (
    values: NoteFormValues,
    helpers: FormikHelpers<NoteFormValues>
  ) => {
    try {
      await mutation.mutateAsync(values);
      helpers.resetForm();
      onCancel();
    } catch {
      // помилку покажемо в UI нижче
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          {mutation.isError && (
            <p className={css.error}>
              Could not create note. Please try again.
            </p>
          )}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={mutation.isPending || isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={mutation.isPending || isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
