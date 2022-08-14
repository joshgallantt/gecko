import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/MyTicketsList.css";
import axios from "axios";
import DataTable from "react-data-table-component";

const MyTicketsList = () => {
  const TICKETS_TICKET_LIST = "/api/tickets";

  const navigate = useNavigate();

  //states for project list
  const [pending, setPending] = React.useState(true);
  const [tickets, setTickets] = useState();
  const [unfilteredTickets, setUnfilteredTickets] = useState();
  const [toggle, setToggle] = useState("Hide");
  function toggleCompleted(e) {
    if (toggle === "Hide") {
      setUnfilteredTickets(tickets);
      var newArray = tickets.filter(function (ticket) {
        return ticket.status !== "Completed";
      });
      setTickets(newArray);
      setToggle("Show");
    } else {
      setTickets(unfilteredTickets);
      setToggle("Hide");
    }
  }

  const getTickets = async () => {
    try {
      console.log("fetching tickets");
      const response = await axios.get(TICKETS_TICKET_LIST, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      console.log(response.data);
      setTickets(response.data);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 3");
      }
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  const columns = [
    {
      name: "PROJECT",
      selector: (row) => row.project,
      wrap: true,
      grow: 1,
    },
    {
      name: "TICKET",
      selector: (row) => row.ticket,
      grow: 1,
      wrap: true,
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      grow: 2,
      wrap: true,
      hide: "md",
    },
    {
      name: "PRIORITY",
      selector: (row) => row.priority,
      grow: 1,
      wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      grow: 1,
      wrap: true,
      hide: "sm",
    },
    {
      name: "TYPE",
      selector: (row) => row.type,
      grow: 1,
      wrap: true,
      hide: "md",
    },
    {
      omit: true,
      cell: () => <button onClick={console.log("hi")}>Action</button>,
      ignoreRowClick: true,
      button: true,
    },
  ];

  return (
    <div className="ticket-list">
      <div className="data-table">
        <div className="data-table-title">
          <h1>My Tickets</h1>
          <button onClick={toggleCompleted} className="button">
            {toggle} Done
          </button>
        </div>
        <DataTable
          columns={columns}
          data={tickets}
          progressPending={pending}
          onRowClicked={(row, event) => {
            navigate(`/project/${row.project_key}/ticket/${row.ticket_key}`);
          }}
          subHeaderAlign="right"
          noDataComponent={
            <div style={{ margin: "40px 0" }}>
              You have no tickets assigned to you!
            </div>
          }
          highlightOnHover
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          pointerOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default MyTicketsList;
