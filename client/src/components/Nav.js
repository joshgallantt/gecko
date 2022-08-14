import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import "./css/nav.css";
import axios from "axios";
import getCookies from "../utils/getCookies";
import { FaBars, FaTimes } from "react-icons/fa";
import { GiGecko } from "react-icons/gi";

export default function Nav() {
  const [click, setClick] = React.useState(false);

  const handleClick = () => setClick(!click);
  const Close = () => setClick(false);

  const state = getCookies();
  const navigate = useNavigate();

  const LOGOUT_URL = "/api/logout";

  const handleLogout = async (e) => {
    try {
      const response = await axios.post(LOGOUT_URL, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        credentials: "include",
      });
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      navigate("/login", {
        data: {
          logout: "logout",
        },
        replace: true,
      });

      return;
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log(err);
      }
    }
  };

  return (
    <div>
      <div className={click ? "main-container" : ""} onClick={() => Close()} />
      <nav className="navbar" onClick={(e) => e.stopPropagation()}>
        <div className="nav-container">
          <div className="nav-logo">
            <NavLink className="gecko-text" exact to="/">
              geck
              <GiGecko className="gecko" size={"40px"} />
            </NavLink>
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                className="nav-links"
                to="dashboard"
                onClick={click ? handleClick : null}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-links"
                to="tickets"
                onClick={click ? handleClick : null}
              >
                Tickets
              </NavLink>
            </li>
            {state.admin && (
              <li className="nav-item">
                <NavLink
                  className="nav-links"
                  to="admin"
                  onClick={click ? handleClick : null}
                >
                  Admin
                </NavLink>
              </li>
            )}
            <li className="nav-item" id="logout" onClick={handleLogout}>
              Log Out
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {click ? <FaTimes size={"3rem"} /> : <FaBars size={"3rem"} />}
          </div>
        </div>
      </nav>
    </div>
  );
}