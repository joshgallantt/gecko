import React from "react";
import { MultiSelect } from "react-multi-select-component";
import { useState, useEffect } from "react";
import axios from "axios";
import "./css/NewProjectModal.css";
import TeamList from "./TeamList";

const AddMemberModal = (props) => {
  const ADD_PROJECT_MEMBERS = `/api/project${props.project}/add`;
  const GET_UNASSIGNED = `/api/project/${props.project}/available`;
  const [pending, setPending] = useState(true);
  const [unassigned, setUnassigned] = useState();
  const [selected, setSelected] = useState([]);

  const getUnassigned = async () => {
    try {
      const response = await axios.get(GET_UNASSIGNED, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      setUnassigned(response.data.rows);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 1");
      }
    }
  };

  const saveOnClick = () => {
    axios
      .post(ADD_PROJECT_MEMBERS, JSON.stringify({ selected }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {
        const oldTeam = props.team;
        const toAdd = selected;
        const newTeam = toAdd.concat(oldTeam);
        props.setTeam(newTeam);
        props.close();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const SaveButton = () => {
    if (selected.length) {
      return (
        <button
          form="form"
          type="submit"
          className="save"
          onClick={saveOnClick}
        >
          Add
        </button>
      );
    } else {
      return (
        <button form="form" type="submit" className="save disabled" disabled>
          Add
        </button>
      );
    }
  };

  useEffect(() => {
    getUnassigned();
  }, []);

  useEffect(() => {
    SaveButton();
  }, [selected]);

  if (!pending) {
    return (
      <section>
        <h1>Add Members</h1>
        <div className="buttons">
          {SaveButton}
          <button className="cancel" onClick={props.close}>
            Cancel
          </button>
        </div>
        <br />
        <div className="devel">
          <label className="form-label">Select Developers:</label>
          <div className="select">
            {console.log(unassigned, selected)}
            <MultiSelect
              options={unassigned}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
              className="multis"
            />
          </div>
        </div>
      </section>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default AddMemberModal;
