import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import "./css/Stats.css";

const Pie = (props) => {
  const TICKET_STATS_URL = "/api/dashboard/ticket-stats";
  const [data, setData] = useState();
  const [pending, setPending] = useState(true);

  const addColorsToData = (response) => {
    console.log("COLORS", response, response.length);
    if (response.length === 0) {
      console.log("length 0 being hit");
      return [{ title: "No Tickets!", value: 1, color: "mediumseagreen" }];
    } else {
      const colors = ["tomato", "sandybrown", "royalblue", "mediumseagreen"];
      const colorData = response.map((i, index) => ({
        ...i,
        color: colors[index],
      }));
      return colorData;
    }
  };

  const getPriority = async () => {
    try {
      const response = await axios.get(TICKET_STATS_URL + "/priority", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      setData(addColorsToData(response.data));
      setPending(false);
      console.log(response);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 7");
      }
    }
  };
  const getStatus = async () => {
    try {
      const response = await axios.get(TICKET_STATS_URL + "/status", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      setData(addColorsToData(response.data));
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 8");
      }
    }
  };
  const getType = async () => {
    try {
      const response = await axios.get(TICKET_STATS_URL + "/type", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      setData(addColorsToData(response.data));
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 9");
      }
    }
  };

  useEffect(() => {
    switch (props.for) {
      case "Priority":
        console.log("loading priority");
        getPriority();
        break;
      case "Status":
        console.log("loading status");
        getStatus();
        break;
      case "Type":
        console.log("loading type");
        getType();
        break;
      default:
        return;
    }
  }, []);

  if (!pending) {
    return (
      <figure className="pie-chart">
        {console.log(data)}
        <h2>Tickets By {props.for}</h2>
        <PieChart
          className="pie"
          radius={35}
          labelStyle={{
            fontSize: "8px",
          }}
          startAngle={200}
          label={(props) => {
            if (Math.round(props.dataEntry.percentage) > 2) {
              return Math.round(props.dataEntry.percentage) + "%";
            } else {
              return " ";
            }
          }}
          labelPosition={120}
          lineWidth={37}
          animate={true}
          data={data}
        />
        <figcaption>
          {data.length > 1 ? (
            data.map(function (d) {
              return (
                <div key={d.title}>
                  {d.title}({d.value})<span style={{ color: d.color }}></span>
                </div>
              );
            })
          ) : (
            <div>No Tickets!</div>
          )}
        </figcaption>
      </figure>
    );
  }
};

export default Pie;
