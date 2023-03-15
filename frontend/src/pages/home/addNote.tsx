import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { useOnClickOutside } from "../../@hooks/useOnClickOutside";
import { FormButton } from "../../@ui/button";
import { breakpoints } from "../../theme/media";
import api, { AddNoteArgs } from '../../data-access';

const Container = styled.div<{ $focused: boolean }>`
  margin: 0 auto;
  padding: 30px;
  width: 60%;
  margin-bottom: 50px;
  box-shadow: ${({ $focused }) =>
    $focused
      ? "0 0 5px 2px rgb(255 255 255 / 30%)"
      : "0 5px 20px 0px rgb(255 255 255 / 0%)"};
  transition: ${({ theme }) => theme.transition};
  background: ${({ theme, $focused }) =>
    $focused ? theme.colors.bg2 : theme.colors.bg};
  ${breakpoints.down("md")} {
    width: 80%;
  }
  ${breakpoints.down("sm")} {
    width: 100%;
  }
`;

const AddNoteInput = styled.textarea`
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

const AddNote: React.FC<{ updateCache: (note: any) => void }> = ({
  updateCache,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [focused, setFocused] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm<AddNoteArgs>();

  const { mutate, isLoading } = useMutation(api.addNote, {
    onSuccess: (data) => {
      updateCache(data.addNote);
      reset();
      setFocused(false);
    },
  });

  const { title, body } = watch();

  useOnClickOutside(containerRef, () => {
    if (title.length === 0 && body.length === 0) {
      setFocused(false);
    }
  });

  return (
    <Container ref={containerRef} $focused={focused}>
      <form onSubmit={handleSubmit(data => mutate(data))}>
        <TitleInput
          style={{
            display: focused ? "block" : "none",
          }}
          placeholder="Note Title"
          {...register("title")}
        />
        <AddNoteInput
          placeholder="Add Note..."
          onFocus={() => setFocused(true)}
          rows={focused ? 4 : 1}
          {...register("body")}
        />
        {focused && (
          <FormButton ignorePadding loading={isLoading}>
            Save
          </FormButton>
        )}
      </form>
    </Container>
  );
};

export default AddNote;
