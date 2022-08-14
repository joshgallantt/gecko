import React from "react";
import "./css/SelectedTicketInfo.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import TimeAgo from "react-timeago";
import { ImBin } from "react-icons/im";
import { useNavigate } from "react-router";

const SelectedTicketInfo = (props) => {
  const { id, ticket } = useParams();
  const GET_TICKET_INFO = `/api/project/ticket-info/${ticket}`;
  const GET_TICKET_DEVS = `/api/project/assigned-devs/${ticket}`;
  const UPDATE_TICKET = `/api/project/update-ticket/${ticket}`;

  const navigate = useNavigate();

  const [pending, setPending] = React.useState(true);
  const [ticketInfo, setTicketInfo] = useState(false);
  const [devsForTicket, setDevsForTicket] = useState(false);

  //buttons
  const [status, setStatus] = useState(ticketInfo.status || false);
  const [priority, setPriority] = useState(ticketInfo.priority || false);
  const [type, setType] = useState(ticketInfo.type || false);

  const toggleStatus = () => {
    if (status === "Not Started") {
      setStatus("In Progress");
    }
    if (status === "In Progress") {
      setStatus("Completed");
    }
    if (status === "Completed") {
      setStatus("Not Started");
    }
  };
  const togglePriority = () => {
    if (priority === "Low") {
      setPriority("Med");
    }
    if (priority === "Med") {
      setPriority("High");
    }
    if (priority === "High") {
      setPriority("Urgent");
    }
    if (priority === "Urgent") {
      setPriority("Low");
    }
  };
  const toggleType = () => {
    if (type === "Bug") {
      setType("Issue");
    }
    if (type === "Issue") {
      setType("Feature");
    }
    if (type === "Feature") {
      setType("Bug");
    }
  };

  const getTicketInfo = async () => {
    try {
      const response = await axios.get(GET_TICKET_INFO, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      console.log(response, "ticketID response");
      setTicketInfo(response.data[0]);
      setStatus(response.data[0].status);
      setPriority(response.data[0].priority);
      setType(response.data[0].type);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      }
    }
  };

  const getTicketDevs = async () => {
    try {
      const response = await axios.get(GET_TICKET_DEVS, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      console.log(response, "devs response");
      setDevsForTicket(response.data);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      }
    }
  };

  const updateTicket = async () => {
    axios
      .put(UPDATE_TICKET, JSON.stringify({ status, type, priority }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (ticket) {
      getTicketInfo();
      getTicketDevs();
    }
  }, [ticket]);

  useEffect(() => {
    if (status && priority && type) {
      updateTicket();
    }
  }, [status, priority, type, updateTicket]);

  return (
    <div className="ticket-info-container">
      <div className="ticket-info">
        <h1 className="ticket-info-title">
          Selected Ticket Info
          {/* <ImBin color="tomato" style={{ cursor: "pointer" }} /> */}
        </h1>
        {ticketInfo ? (
          <>
            {console.log(ticketInfo, "ticket info here")}
            <div className="ticket-info-ticket">
              <h6>TICKET</h6>
              <div>{ticketInfo.ticket}</div>
            </div>
            <div className="ticket-info-author">
              <h6>AUTHOR</h6>
              <div>{ticketInfo.author}</div>
            </div>
            <div className="ticket-info-description">
              <h6>DESCRIPTION</h6>
              <div>{ticketInfo.description}</div>
            </div>
            <div className="ticket-info-status">
              <h6>STATUS</h6>
              <button
                className={status}
                onClick={() => {
                  toggleStatus();
                  navigate(0);
                }}
              >
                {status}
              </button>
            </div>
            <div className="ticket-info-priority">
              <h6>PRIORITY</h6>
              <button
                className={priority}
                onClick={() => {
                  togglePriority();
                  navigate(0);
                }}
              >
                {priority}
              </button>
            </div>
            <div className="ticket-info-type">
              <h6>TYPE</h6>
              <button
                className={type}
                onClick={() => {
                  toggleType();
                  navigate(0);
                }}
              >
                {type}
              </button>
            </div>
            <div className="ticket-info-created">
              <h6>CREATED</h6>
              <div>
                <TimeAgo date={ticketInfo.created} live={false} />
              </div>
            </div>
            <div className="ticket-info-developers">
              <h1>Assigned Devs</h1>
              {devsForTicket.length > 0 ? (
                <div className="ticket-info-developers-cols">
                  <div className="ticket-info-developers-column">
                    <h6>NAME</h6>
                    {console.log("devsforticket", devsForTicket)}
                    {devsForTicket &&
                      devsForTicket.map((dev) => {
                        return <div key={dev.email + "name"}>{dev.name}</div>;
                      })}
                  </div>
                  <div className="ticket-info-developers-column">
                    <h6>EMAIL</h6>
                    {devsForTicket &&
                      devsForTicket.map((dev) => {
                        return <div key={dev.email + "email"}>{dev.email}</div>;
                      })}
                  </div>
                </div>
              ) : (
                <div>No developers assigned to this ticket!</div>
              )}
            </div>
          </>
        ) : (
          <div>No ticket selected.</div>
        )}
      </div>
    </div>
  );
};

export default SelectedTicketInfo;
