import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../@ui/button";
import ImgUrl from "../../@imgs/emmanuel-ikwuegbu.jpg";
import { breakpoints } from "../../theme/media";
import { useCurrentUserQuery } from "../../gql/generated/graphql";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  width: fit-content;
`;

const StyledImg = styled.img`
  height: 100%;
  position: absolute;
  top: 0;
  right: 100px;
  z-index: -100;
  ${breakpoints.down("md")} {
    right: 0;
  }
  ${breakpoints.down("sm")} {
    display: none;
  }
`;

const ImgCredit = styled.span`
  display: block;
  position: absolute;
  bottom: 0;
  right: 100px;
  padding: 16px;
  ${breakpoints.down("md")} {
    right: 0;
  }
  ${breakpoints.down("sm")} {
    display: none;
  }
`;

const H1 = styled.h1`
  margin-bottom: 150px;
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  let location = useLocation();

  const { data, loading } = useCurrentUserQuery();

  useEffect(() => {
    if (!loading && data?.currentUser) {
      // logged in
      navigate("/notes");
    }
  }, [data, loading, navigate]);

  return (
    <Container>
      <div>
        <H1>Capture what’s on your mind</H1>
      </div>
      <StyledImg src={ImgUrl} alt="man using this app" />
      <ImgCredit>
        Photo by{" "}
        <a href="https://unsplash.com/@emmages?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
          Emmanuel Ikwuegbu
        </a>{" "}
        on{" "}
        <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
          Unsplash
        </a>
      </ImgCredit>
      <Button
        onClick={() =>
          navigate("/signup", { state: { backgroundLocation: location } })
        }
      >
        Sign Up
      </Button>
      <Button
        onClick={() =>
          navigate("/login", { state: { backgroundLocation: location } })
        }
      >
        Login
      </Button>
    </Container>
  );
};
export default LandingPage;
