import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./css/ProjectTicketList.css";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router";

import NewTicketModal from "./NewTicketModal";
import Modal from "react-modal";

const ProjectTicketList = (props) => {
  const { id, ticket } = useParams();
  const PROJECT_TICKET_LIST = `/api/project/${id}/tickets`;
  const navigate = useNavigate();
  const [pending, setPending] = React.useState(true);
  const [tickets, setTickets] = useState();
  const [unfilteredTickets, setUnfilteredTickets] = useState();
  const [modalIsOpen, setIsOpen] = React.useState(false);
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
      const response = await axios.get(PROJECT_TICKET_LIST, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      console.log(response.data);
      setTickets(response.data);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("No Server Response");
      }
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    getTickets();
  }, []);

  const columns = [
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
      hide: "sm",
    },
    {
      name: "AUTHOR",
      selector: (row) => row.author,
      grow: 1,
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
    },
    {
      omit: true,
      cell: () => <button onClick={console.log("hi")}>Action</button>,
      ignoreRowClick: true,
      button: true,
    },
  ];

  return (
    <div className="project-ticket-list">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            maxHeight: "650px",
            maxWidth: "500px",
            margin: "auto",
            overflow: "none",
          },
        }}
      >
        <NewTicketModal
          project={id}
          close={closeModal}
          update={getTickets}
          className={"modality"}
        />
      </Modal>
      <div className="project-ticket-data-table">
        <div className="data-table-title">
          <h1>Tickets</h1>
          <button onClick={toggleCompleted} className="button">
            {toggle} Done
          </button>
          <button onClick={openModal} className="button">
            New Ticket
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
            <div style={{ margin: "40px 0", height: "100%" }}>
              This project has no tickets!
            </div>
          }
          highlightOnHover
          pagination
          paginationPerPage={4}
          paginationRowsPerPageOptions={[4, 8, 12]}
          pointerOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default ProjectTicketList;
