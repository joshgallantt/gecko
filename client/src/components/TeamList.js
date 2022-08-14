import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useParams } from "react-router";
import "./css/TeamList.css";
import getCookies from "../utils/getCookies";
import { ImBin } from "react-icons/im";
import AddMemberModal from "./AddMemberModal";

const TeamList = (props) => {
  const { id, ticket } = useParams();
  const GET_ASSIGNED_MEMBERS = `/api/project/${id}/assigned`;
  const DEL_USER_FROM_PROJECT = `/api/project/${id}/delete-member/`;
  const GET_AVAILABLE_MEMBERS = `/api/project/${id}/available`;
  const ADD_MEMBERS_URL = `/api/project/${id}/add`;

  const [pending, setPending] = React.useState(true);
  const [team, setTeam] = useState();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [omitDel, setOmitDel] = useState(true);

  const getTeam = async () => {
    try {
      const response = await axios.get(GET_ASSIGNED_MEMBERS, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      console.log(response.data);
      setTeam(response.data);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      }
    }
  };

  const checkAdmin = () => {
    const cookies = getCookies();
    if (cookies.admin === true) {
      setOmitDel(false);
    } else {
      setOmitDel(true);
    }
  };

  const DeleteButton = ({ row, onClick }) => {
    const clickHandler = () => onClick(row);

    return (
      <ImBin
        color="tomato"
        size="18px"
        style={{ cursor: "pointer" }}
        onClick={clickHandler}
      />
    );
  };

  const handleDelete = async (row) => {
    console.log(id);
    console.log(row);
    console.log(team);
    const newTeam = team.filter((member) => member.id !== row.id);
    try {
      await axios.delete(DEL_USER_FROM_PROJECT + row.id, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      setTeam(newTeam);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      }
    }
  };

  useEffect(() => {
    getTeam();
    checkAdmin();
  }, []);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      wrap: true,
      grow: 1,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      wrap: true,
      grow: 2,
    },
    {
      cell: (row) => (
        <DeleteButton row={row} onClick={handleDelete}></DeleteButton>
      ),
      right: true,
      omit: omitDel,
    },
  ];
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="team-list">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            maxHeight: "500px",
            maxWidth: "500px",
            margin: "auto",
            overflow: "none",
          },
        }}
      >
        <AddMemberModal
          project={id}
          close={closeModal}
          team={team}
          setTeam={setTeam}
          className={"modality"}
        />
      </Modal>
      <div className="team-data-table">
        <div className="data-table-title">
          <h1>Project Members</h1>
          {props.cookies?.admin && (
            <button onClick={openModal} className="add-member-button">
              Add Member
            </button>
          )}
        </div>
        <DataTable
          columns={columns}
          data={team}
          progressPending={pending}
          noDataComponent={
            <div style={{ margin: "20px" }}>
              This project has no assigned members!
            </div>
          }
          subHeaderAlign="right"
          pagination
          paginationPerPage={5}
          paginationComponentOptions={{ noRowsPerPage: true }}
          responsive
        />
      </div>
    </div>
  );
};

export default TeamList;
