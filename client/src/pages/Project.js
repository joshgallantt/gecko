import React from "react";
import { useEffect, useState } from "react";
import getCookies from "../utils/getCookies";
import styled from "styled-components";
import ProjectTitle from "../components/ProjectTitle";
import TeamList from "../components/TeamList";
import SelectedTicketInfo from "../components/SelectedTicketInfo";
import ProjectTicketList from "../components/ProjectTicketList";
import CommentSection from "../components/CommentSection";

const Tickets = () => {
  const [cookies, setCookies] = useState();

  const ProjectContainer = styled.section`
    margin: auto;
    width: 95vw;
  `;

  const InfoContainer = styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 20px 0;
    min-width: 370px;
    flex-shrink: 2;
  `;

  const MiddleContainer = styled.section`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0 20px;
    @media (max-width: 1000px) {
      flex-wrap: wrap;
    }
  `;

  useEffect(() => {
    setCookies(getCookies());
  }, []);

  return (
    <ProjectContainer>
      <MiddleContainer>
        <InfoContainer>
          <ProjectTitle></ProjectTitle>
          <TeamList cookies={cookies}></TeamList>
        </InfoContainer>
        <ProjectTicketList />
      </MiddleContainer>
      <SelectedTicketInfo></SelectedTicketInfo>
      <CommentSection />
    </ProjectContainer>
  );
};

export default Tickets;
