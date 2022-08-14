import React from "react";
import { useEffect, useState } from "react";
import getCookies from "../utils/getCookies";
import MyTicketsList from "../components/MyTicketsList";
import styled from "styled-components";

const Tickets = () => {
  const [cookies, setCookies] = useState();

  const TicketsContainer = styled.section`
    margin: auto;
    width: 95vw;
    display: flex;
    flex-wrap: wrap;
  `;
  useEffect(() => {
    setCookies(getCookies());
  }, []);
  return (
    <TicketsContainer>
      <MyTicketsList />
    </TicketsContainer>
  );
};

export default Tickets;
