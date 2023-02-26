import styled from "styled-components";
import { breakpoints } from "../../theme/media";

const duration = 250;

export const Root = styled.div`
  position: fixed;
  z-index: 2000;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.hover};
  display: block;

  transition: ${({ theme }) => theme.transition};

  &.ani-enter {
    opacity: 0;
  }
  &.ani-enter-active {
    transition: opacity ${duration}ms;
    opacity: 1;
  }
  &.ani-exit {
    opacity: 1;
  }
  &.ani-exit-active {
    transition: opacity ${duration}ms;
    opacity: 0;
  }
`;

export const InnerContent = styled.div`
  max-width: 600px;
  min-width: 460px;
  min-height: 240px;
  ${breakpoints.down("sm")} {
    min-width: calc(100% - 64px);
    max-width: calc(100% - 64px);
  }
  background: ${({ theme }) => theme.colors.bg2};
  position: fixed;
  max-height: calc(100% - 64px);
  overflow-y: auto;
  box-shadow: 0 5px 20px 0px rgb(255 255 255 / 30%);
  padding: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${Root}.ani-enter & {
    transform: translate(-50%, -50%) scale(0.8);
  }
  ${Root}.ani-enter-active & {
    transition: transform ${duration}ms;
    transform: translate(-50%, -50%) scale(1);
  }
  ${Root}.ani-exit & {
    transform: translate(-50%, -50%) scale(1);
  }
  ${Root}.ani-exit-active & {
    transition: transform ${duration}ms;
    transform: translate(-50%, -50%) scale(0.8);
  }
`;
export const Body = styled.div``;
