import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./css/ProjectTitle.css";

const ProjectTitle = () => {
  const { id, ticket } = useParams();
  const [pending, setPending] = useState();
  const [projectInfo, setProjectInfo] = useState({ title: "loading" });
  const GET_PROJECTS_INFO = `/api/project/info/${id}`;

  const getProjectInfo = async () => {
    try {
      const response = await axios.get(GET_PROJECTS_INFO, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      console.log("my data", response);
      setProjectInfo(response.data);
      setPending(false);
    } catch (err) {
      if (!err?.response) {
        alert("NO RESPONSE 6");
      }
    }
  };
  useEffect(() => {
    getProjectInfo();
  }, []);
  return <h1 className="title">{!pending && projectInfo.title}</h1>;
};

export default ProjectTitle;
