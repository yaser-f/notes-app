import React from "react";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { Body, InnerContent, Root } from "./styles";

import ReactDOM from "react-dom";
import { useOnClickOutside } from "../../@hooks/useOnClickOutside";

export const DIALOG_TRANSITION_DURATION = 250;

const DialogBody: React.FC<{
  close: () => void;
}> = ({ close, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => close());

  return ReactDOM.createPortal(
    <Root onClick={(e) => e.stopPropagation()}>
      <InnerContent ref={ref}>
        <Body>{children}</Body>
      </InnerContent>
    </Root>,
    document.body
  );
};

const Dialog: React.FC<{
  open: boolean;
  close: () => void;
}> = ({ children, open, close }) => {
  return (
    <CSSTransition
      in={open}
      classNames="ani"
      unmountOnExit
      timeout={DIALOG_TRANSITION_DURATION}
    >
      <DialogBody close={close}>{children}</DialogBody>
    </CSSTransition>
  );
};

export default Dialog;
