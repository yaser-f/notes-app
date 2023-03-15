import { useQuery } from '@tanstack/react-query';
import React from "react";
import styled from "styled-components";
import api from '../../data-access';
import AddNote from "./addNote";
import Notes from "./notes";

const HeaderContainer = styled.div`
  margin-bottom: 150px;
`;

const HomePage: React.FC = () => {
  const { data, isLoading, refetch } = useQuery(['notes'], api.getNotes);


  return (
    <div>
      <HeaderContainer>
        <AddNote updateCache={() => refetch()} />
        {isLoading && <span>loading...</span>}
        {data && <Notes notes={data} />}
      </HeaderContainer>
    </div>
  );
};

export default HomePage;
