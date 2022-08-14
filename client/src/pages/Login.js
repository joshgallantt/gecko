import { useRef, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaUnlockAlt } from "react-icons/fa";
import { GiGecko } from "react-icons/gi";

import axios from "axios";
import "../components/css/login.css";
const LOGIN_URL = "/api/login";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cookies = new Cookies();
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          credentials: "include",
        }
      );
      cookies.set("email", response.data.user.email, {
        path: "/",
        maxAge: 1000000,
      });
      cookies.set("first_name", response.data.user.first_name, {
        path: "/",
        maxAge: 1000000,
      });
      cookies.set("last_name", response.data.user.last_name, {
        path: "/",
        maxAge: 1000000,
      });
      console.log(response.data.user.admin);
      if (response.data.user.admin) {
        cookies.set("admin", response.data.user.admin, {
          path: "/",
          maxAge: 1000000,
        });
      }
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
      return;
    } catch (err) {
      if (err.response?.data?.message) {
        setErrMsg(err?.response?.data?.message);
      } else {
        setErrMsg("No Server Response.");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="login-wrapper">
      <GiGecko className="gecko-bg" size={"3100px"} />
      <div className="login-container">
        <div className="login-title">
          <GiGecko size={"38px"} color={"mediumseagreen"} />
          <h1>Welcome to Gecko</h1>
          <h5>A project management tool for software development.</h5>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="inputs-container">
            <label className="input">
              <FaEnvelope className="icon" />
              <input
                type="text"
                className="email"
                placeholder="email"
                ref={emailRef}
                autoComplete="off"
                onClick={(e) => e.target.select()}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </label>
            <label className="input">
              <FaUnlockAlt className="icon" />
              <input
                type="password"
                className="password"
                placeholder="password"
                onClick={(e) => e.target.select()}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </label>
          </div>
          <div
            ref={errRef}
            className={errMsg ? "error" : "hide"}
            aria-live="assertive"
          >
            {errMsg}
          </div>
          <button>Sign In</button>
        </form>
        <h6>
          Admin Account: admin/password1
          <br />
          Dev Account: dev/password1
        </h6>
        <a className="copyright" href="http://www.google.com">
          &copy; 2022 Josh Gallant
        </a>
      </div>
    </div>
  );
};

export default Login;
