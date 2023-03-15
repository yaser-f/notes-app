import React from "react";
import { Link, useLocation } from "react-router-dom";

import styled from "styled-components";
import { Note } from '../../data-access';
import { breakpoints } from "../../theme/media";

const GridContainer = styled.ul`
  padding: 0;
  margin: 0;
  width: 100%;
  display: grid;
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  grid-template-columns: repeat(4, 1fr);

  ${breakpoints.down("md")} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${breakpoints.down("sm")} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GridItem = styled.li`
  list-style: none;
  justify-self: stretch;
  align-self: stretch;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bg2};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textPri};
`;

const ContentContainer = styled.div`
  padding: 10px;
  height: 240px;
  background-color: ${({ theme }) => theme.colors.transparent};
  transition: ${({ theme }) => theme.transition};
  ${StyledLink}:hover & {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const NoteTitle = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.colors.textPri};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 12px;
`;

const NoteBody = styled.span`
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
  white-space: pre-wrap;
`;

const Notes: React.FC<{ notes: Note[] }> = ({ notes }) => {
  let location = useLocation();

  return (
    <GridContainer>
      {notes.map((n) => (
        <GridItem key={n.id}>
          <StyledLink
            to={`/note/${n.id}`}
            state={{ backgroundLocation: location }}
          >
            <ContentContainer>
              <NoteTitle>{n.title}</NoteTitle>
              <NoteBody>{n.body}</NoteBody>
            </ContentContainer>
          </StyledLink>
        </GridItem>
      ))}
    </GridContainer>
  );
};

export default Notes;
