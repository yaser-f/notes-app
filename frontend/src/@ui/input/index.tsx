import React from "react";
import styled from "styled-components";

const InputContainer = styled.div`
  display: block;
  padding: 16px;
  border: none;
  background: none;
  /* height: 80px; */
  overflow: hidden;
`;

const StyledInput = styled.input`
  background: none;
  border: none;
  &:focus {
    outline: none;
  }
`;

const Underline = styled.div`
  position: relative;
  height: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.textPri};
  margin-left: auto;
  z-index: -10;
  transition: ${({ theme }) => theme.transition};

  top: 0;
`;

export const Input: React.FC<{
  placeholder: string;
  name: string;
  register: any;
  type?: React.HTMLInputTypeAttribute;
}> = ({ placeholder, register, name, type }) => {
  return (
    <InputContainer>
      <StyledInput
        placeholder={placeholder}
        type={type || "text"}
        {...register(name, { required: true })}
      />
      <Underline />
    </InputContainer>
  );
};
