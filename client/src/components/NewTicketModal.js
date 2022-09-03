import React from "react";
import { MultiSelect } from "react-multi-select-component";
import { useState, useEffect } from "react";
import axios from "axios";
import { RadioGroup, Radio } from "react-radio-group";
import { useNavigate } from "react-router";
import "./css/NewProjectModal.css";

const NewTicketModal = (props) => {
  const GET_ASSIGNED_MEMBERS = `/api/project/${props.project}/new-ticket-available`;
  const POST_NEW_TICKET = `/api/project/new-ticket/${props.project}`;
  const BASE_URL_REDIRECT = `/`;
  const [pending, setPending] = useState(true);
  const [team, setTeam] = useState([]);
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Bug");
  const [priority, setPriority] = useState("Low");
  const navigate = useNavigate();

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

  const saveOnClick = (e) => {
    e.preventDefault();
    axios
      .post(
        POST_NEW_TICKET,
        JSON.stringify({ title, description, priority, type, selected }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        // window.location.href = `${
        //   BASE_URL_REDIRECT +
        //   "/project/" +
        //   props.project +
        //   "/ticket/" +
        //   response.data
        // }`;
        navigate(`/project/${props.project}/ticket/${response.data}`, {
          data: {
            hi: "hi",
          },
          replace: false,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const SaveButton = () => {
    if (selected.length && title && description) {
      return (
        <button form="form" type="submit" className="save">
          Create
        </button>
      );
    } else {
      return (
        <button form="form" type="submit" className="save disabled" disabled>
          Create
        </button>
      );
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

  useEffect(() => {
    SaveButton();
  }, [selected, title, description]);

  if (!pending) {
    return (
      <section>
        {console.log("RETURNING", team)}
        <h1>Create New Ticket</h1>
        <br />
        <div className="devel">
          <label className="form-label">Assign Developers:</label>
          <div className="select">
            <MultiSelect
              options={team}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </div>
        </div>
        <form id="form" onSubmit={saveOnClick}>
          <label className="form-label" htmlFor="title">
            Ticket Title:
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
            Ticket Description:
          </label>
          <textarea
            className="input2"
            type="text"
            id="description"
            autoComplete="off"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
          <br />
          <label className="form-label" htmlFor="description">
            Priority:
          </label>
          <RadioGroup
            className="radio"
            name="Priority"
            selectedValue={priority}
            onChange={(value) => {
              setPriority(value);
            }}
          >
            <label>
              <Radio value="Low" />
              Low
            </label>
            <label>
              <Radio value="Med" />
              Med
            </label>
            <label>
              <Radio value="High" />
              High
            </label>
            <label>
              <Radio value="Urgent" />
              Urgent
            </label>
          </RadioGroup>
          <br />
          <label className="form-label" htmlFor="type">
            Type:
          </label>
          <RadioGroup
            className="radio"
            name="Type"
            selectedValue={type}
            onChange={(value) => {
              setType(value);
            }}
          >
            <label>
              <Radio value="Bug" />
              Bug
            </label>
            <label>
              <Radio value="Issue" />
              Issue
            </label>
            <label>
              <Radio value="Feature" />
              Feature
            </label>
          </RadioGroup>
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

export default NewTicketModal;
