import React from "react";
import { useEffect, useState } from "react";
import getCookies from "../utils/getCookies";
import ProjectList from "../components/ProjectList";
import Stats from "../components/Stats";
import styled from "styled-components";

export default function Dashboard() {
  const [cookies, setCookies] = useState();

  const DashboardContainer = styled.section`
    margin: auto;
    width: 95vw;
    display: flex;
    flex-wrap: wrap;
  `;

  const ProjectListContainer = styled.section`
    width: 100%;
    display: flex;
    justify-content: center;
  `;

  useEffect(() => {
    setCookies(getCookies());
  }, []);
  return (
    <DashboardContainer>
      <ProjectListContainer>
        <ProjectList cookies={cookies} />
      </ProjectListContainer>
      <Stats for="Priority"></Stats>
      <Stats for="Status"></Stats>
      <Stats for="Type"></Stats>
    </DashboardContainer>
  );
}
