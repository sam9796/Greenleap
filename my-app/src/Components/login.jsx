import React, { useState, useEffect } from "react";
import "../Style/login.css";
import { useNavigate } from "react-router-dom";
import Footer from "./footer.jsx";
import Logo from "../Assets/logo.png";
import { toast } from "react-toastify";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  useEffect(() => {
    const func = async () => {
      if (sessionStorage.getItem("token")) {
        navigate("/");
      }
    };
    func();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://13.233.231.169/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      sessionStorage.setItem("token", json.authtoken);
      navigate("/");
    } else {
      toast.error("Invalid credentials", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setCredentials({ email: "", password: "" });
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div style={{ backgroundColor: "#8cc63e" }}>
        <div className="navbar">
          <div style={{ paddingLeft: "10%" }}>
            {" "}
            <img
              style={{
                width: "176px",
                padding: "14px",
                backgroundColor: "white",
                borderRadius: "30px",
              }}
              src={Logo}
              alt="not found"
            />
          </div>
        </div>
      </div>
      <div className="login">
        <form className="form" onSubmit={handleSubmit}>
          <label
            htmlFor="heading"
            style={{ fontSize: "35px", fontWeight: "600" }}
          >
            Login
          </label>
          <div className="mb-3" style={{ textAlign: "left" }}>
            <br />
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              style={{ height: "50px" }}
              className="form-control"
              value={credentials.email}
              onChange={onChange}
              id="email"
              name="email"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3" style={{ textAlign: "left" }}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              style={{ height: "50px" }}
              className="form-control"
              value={credentials.password}
              onChange={onChange}
              name="password"
              id="password"
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#8cc63e",
              fontWeight: "600",
              color: "white",
            }}
            className="btn"
          >
            Submit
          </button>
        </form>
        <Footer />
      </div>
    </>
  );
}

export default Login;
