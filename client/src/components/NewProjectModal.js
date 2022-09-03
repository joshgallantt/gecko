import React from "react";
import { MultiSelect } from "react-multi-select-component";
import { useState, useEffect } from "react";
import axios from "axios";
import "./css/NewProjectModal.css";

const NewProjectModal = (props) => {
  const DASHBOARD_ACCOUNT_LIST = "/api/dashboard/get-accounts";
  const [pending, setPending] = useState(true);
  const [developers, setDevelopers] = useState();
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const getDevelopers = async (props) => {
    try {
      const response = await axios.get(DASHBOARD_ACCOUNT_LIST, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      setDevelopers(response.data.rows);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 4");
      }
    }
  };

  const saveOnClick = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/dashboard",
        JSON.stringify({ title, description, selected }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then(() => {
        props.close();
        props.update();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getDevelopers();
  }, []);

  useEffect(() => {
    console.log(selected, title, description);
  }, [selected, title, description]);

  const SaveButton = () => {
    if (selected.length && title && description) {
      return (
        <button form="form" type="submit" className="save">
          Create
        </button>
      );
    } else {
      <button form="form" type="submit" className="save disabled" disabled>
        Create
      </button>;
    }
  };

  if (!pending) {
    return (
      <section>
        <h1>Create New Project</h1>
        <div className="devel">
          <label className="form-label">Select Developers:</label>
          <div className="select">
            <MultiSelect
              options={developers}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </div>
        </div>
        <form id="form" onSubmit={saveOnClick}>
          <label className="form-label" htmlFor="title">
            Project Title:
          </label>
          <input
            className="input1"
            type="text"
            id="title"
            autoComplete="off"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <br />
          <label className="form-label" htmlFor="description">
            Project Description:
          </label>
          <br />
          <textarea
            className="input2"
            type="text"
            id="description"
            autoComplete="off"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </form>
        <br />
        <div className="buttons">
          {SaveButton}
          <button className="cancel" onClick={props.close}>
            Cancel
          </button>
        </div>
      </section>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default NewProjectModal;
