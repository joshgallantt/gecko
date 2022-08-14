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

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/dashboard",
        JSON.stringify({ title, description, selected }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 409) {
        console.log("Already Created");
      } else {
        console.log("Creation Failed");
      }
    }
  };

  const saveOnClick = (e) => {
    e.preventDefault();
    axios
      .post("/dashboard", JSON.stringify({ title, description, selected }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
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

  if (!pending) {
    return (
      <section>
        <h1>Create New Project</h1>
        <div className="devel">
          <label className="form-label">Select Developers:</label>
          <div className="select">
            {console.log(developers, selected)}
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
            required
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
            required
          />
        </form>
        <br />
        <div className="buttons">
          <button form="form" type="submit" className="save">
            Create
          </button>
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