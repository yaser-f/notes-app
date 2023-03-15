import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { IconButton } from "../../@ui/button";
import Dialog, { DIALOG_TRANSITION_DURATION } from "../../@ui/dialog";
import api, { Note, UpdateNoteArgs } from '../../data-access';

const ContentContainer = styled.div`
  /* padding: 10px; */
`;

const NoteInput = styled.textarea`
  display: block;

  resize: none;
  outline: none;
  width: 100%;
  background: none;
  border: none;
  margin-bottom: 12px;
  font-size: ${({ theme }) => theme.font.size.md};

  &:focus {
    outline: none;
  }
`;

const TitleInput = styled.input`
  display: block;

  width: 100%;
  background: none;
  border: none;
  margin-bottom: 12px;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.bold};

  &:focus {
    outline: none;
  }
`;

const SpaceBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NoteContent = React.forwardRef<
  HTMLButtonElement,
  { note: Note; closeDialog: () => any }
>(({ note, closeDialog }, ref) => {
  const { mutate: updateNote } = useMutation(api.updateNote);
  const { mutate: deleteNote } = useMutation(api.deleteNote, {
    onSuccess: () => closeDialog(),
    onError: (err) => console.log('err', err),
  });

  const { register, handleSubmit } = useForm<Omit<UpdateNoteArgs, 'id'>>({
    defaultValues: {
      title: note.title,
      body: note.body,
    },
  });

  return (
    <ContentContainer>
      <form onSubmit={handleSubmit(data => updateNote({ id: note.id, ...data }))}>
        <TitleInput placeholder="Note Title" {...register("title")} />
        <NoteInput placeholder="Note..." rows={10} {...register("body")} />
        <SpaceBetween>
          <button type="submit" ref={ref} hidden={true}></button>
          <IconButton name="remove" onClick={() => deleteNote(note.id)} />
        </SpaceBetween>
      </form>
    </ContentContainer>
  );
});

const NotePage = () => {
  let navigate = useNavigate();

  let { id } = useParams<'id'>();

  const [openDialog, setOpenDialog] = useState(false);

  const { data, isLoading } = useQuery(['note', id], () => api.getNote(id!), {
    enabled: !!id,
  });

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpenDialog(true);
  }, []);

  const closeDialog = () => {
    setOpenDialog(false);
    submitButtonRef.current?.click();
    setTimeout(() => {
      navigate(-1);
    }, DIALOG_TRANSITION_DURATION);
  };

  return (
    <Dialog aria-labelledby="label" close={closeDialog} open={openDialog}>
      {isLoading && <span>loading...</span>}
      {data && (
        <NoteContent
          ref={submitButtonRef}
          closeDialog={closeDialog}
          note={data}
        />
      )}
    </Dialog>
  );
};

export default NotePage;
