import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Create a separate CSS file for styling

export default function Login() {

  const createUser = () => {
    // localStorage.removeItem("authToken")
    Navigate("/create");
  }

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is logging in as admin
  const [emailError, setEmailError] = useState(""); // State for email error
  const [passwordError, setPasswordError] = useState(""); // State for password error

  let Navigate = useNavigate();

  const handleSubmit = async (err) => {
    err.preventDefault(); // Prevent page reload on form submit

    setEmailError("");
    setPasswordError("");

    // Determine the endpoint based on whether it's an admin or user login
    const loginEndpoint = credentials.email.includes("admin")
      ? "http://localhost:5000/api/loginadmin"
      : "http://localhost:5000/api/loginuser";

    const response = await fetch(loginEndpoint, {
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
    console.log(json, " ", json.errors);

    if (!json.success) {
      if (json.errors) {
        setEmailError(json.errors.email || "");
        setPasswordError(json.errors.password || "");
      }
    }

    if (json.success) {
      if (json.isAdmin ) {
        localStorage.setItem("adminEmail", credentials.email);
        localStorage.setItem("adminToken", json.authToken);
        console.log("Admin Token Set:", json.authToken);
        Navigate("/admin/orders");
      } else {
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("authToken", json.authToken);
        console.log("authToken", json.authToken);
        Navigate("/");
      }
    }
  };

  const onChange = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="container login">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="email"
            value={credentials.email}
            onChange={onChange}
          />
          <div className="email error">{emailError}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={credentials.password}
            onChange={onChange}
          />
          <div className="password error">{passwordError}</div>
        </div>
        <div className="form-check">
          {/* <input
            type="checkbox"
            className="form-check-input"
            id="isAdmin"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          /> */}
          {/* <label className="form-check-label" htmlFor="isAdmin">
            Login as Admin
          </label> */}
        </div>
        <button type="submit" className="btn btn-warning">
          Submit
        </button>
        <button type="" className="btn btn-success" onClick={createUser}>
        New user
        </button>
      </form>
    </div>
  );
}
