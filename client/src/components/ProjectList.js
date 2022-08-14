import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/projectlist.css";
import Modal from "react-modal";
import axios from "axios";
import DataTable from "react-data-table-component";
import { MdAddCircle } from "react-icons/md";

import NewProjectModal from "./NewProjectModal";

Modal.setAppElement("#root");

export default function Projects(props) {
  const DASHBOARD_PROJECT_LIST = "/api/dashboard/project-list";

  const navigate = useNavigate();

  //states for project list
  const [pending, setPending] = React.useState(true);
  const [projects, setProjects] = useState();

  //states for new project modal
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const getProjects = async () => {
    try {
      console.log("fetching");
      const response = await axios.get(DASHBOARD_PROJECT_LIST, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      console.log(response.data);
      setProjects(response.data);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 5");
      }
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const columns = [
    {
      name: "TITLE",
      selector: (row) => row.title,
      wrap: true,
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      grow: 2,
      wrap: true,
    },
    {
      name: "ASSIGNED",
      selector: (row) => row.assigned,
      wrap: true,
      grow: 2,
      hide: "sm",
    },
    {
      omit: true,
      cell: () => <button onClick={console.log("hi")}>Action</button>,
      ignoreRowClick: true,
      button: true,
    },
  ];

  return (
    <div className="project-list">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            maxHeight: "50vh",
            maxWidth: "500px",
            margin: "auto",
          },
        }}
      >
        <NewProjectModal close={closeModal} update={getProjects} />
      </Modal>
      <div className="project-data-table">
        <div className="project-data-table-title">
          <h1>Project List</h1>
          {props.cookies?.admin && (
            <button onClick={openModal} className="new-project-button">
              Create Project
            </button>
          )}
        </div>
        <DataTable
          columns={columns}
          data={projects}
          progressPending={pending}
          onRowClicked={(row, event) => {
            navigate(`/project/${row.key}`);
          }}
          subHeaderAlign="right"
          noDataComponent={
            <div style={{ margin: "40px 0" }}>There are no more projects!</div>
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
}
