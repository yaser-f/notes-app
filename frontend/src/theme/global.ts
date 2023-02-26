import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: ${({ theme }) => theme.font.size.md};
    font-weight: ${({ theme }) => theme.font.weight.normal};
    color: ${({ theme }) => theme.colors.textPri};
    font-family: 'Roboto', sans-serif;
  }
  body {
    background-color: ${(props) => props.theme.colors.bg};
  }
  h1, h2, h3, h4, h5, h6, button {
    margin: 0;
    padding: 0;
  }
  h1 {
    font-size: ${({ theme }) => theme.font.size.h1};
    font-weight: ${({ theme }) => theme.font.weight.bold};
    color: ${({ theme }) => theme.colors.textPri};
  }
`;
