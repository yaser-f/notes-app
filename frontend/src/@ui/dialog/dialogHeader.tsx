import React from "react";
import styled from "styled-components";
import { IconButton } from "../button";

export const Header = styled.div`
  margin-bottom: 20px;
  height: 27px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const DialogHeader: React.FC<{ close: () => any }> = ({
  children,
  close,
}) => (
  <Header>
    <span>{children}</span>
    <IconButton onClick={close} name="close" />
  </Header>
);
