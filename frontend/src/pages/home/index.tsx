import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Note,
  useCurrentUserQuery,
  useNotesQuery,
} from "../../gql/generated/graphql";
import AddNote from "./addNote";
import Notes from "./notes";

const HeaderContainer = styled.div`
  margin-bottom: 150px;
`;

const HomePage: React.FC = () => {
  const { data, loading, updateQuery } = useNotesQuery();
  const navigate = useNavigate();

  const { data: currentUserQuery } = useCurrentUserQuery();

  useEffect(() => {
    if (!loading && !currentUserQuery?.currentUser) {
      // not logged in
      navigate("/");
    }
  }, [data, loading, navigate]);

  const updateCacheWhenNoteAdded = (note: Note) => {
    updateQuery((prev) => ({
      notes: [note, ...prev.notes],
    }));
  };

  return (
    <div>
      <HeaderContainer>
        <AddNote updateCache={updateCacheWhenNoteAdded} />
        {loading && <span>loading...</span>}
        {data && data.notes && <Notes notes={data.notes} />}
      </HeaderContainer>
    </div>
  );
};

export default HomePage;
