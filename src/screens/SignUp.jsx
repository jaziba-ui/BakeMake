import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function SignUp() {
  const loginUser = () => {
    // localStorage.removeItem("authToken")
    Navigate("/login");
  };
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = async (err) => {
    err.preventDefault();
    // console.log(
    //   JSON.stringify({
    //     name: credentials.name,
    //     email: credentials.email,
    //     password: credentials.password,
    //     location: credentials.geolocation,
    //     isAdmin: credentials.isAdmin,
    //   })
    // );

    console.log("Submitting credentials:", credentials.isAdmin);

    // Depending on isAdmin, call createuser or createadmin
    const url = credentials.isAdmin
      ? "http://localhost:5000/api/createadmin"
      : "http://localhost:5000/api/createuser";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation,
        isAdmin: credentials.isAdmin,
      }),
    });

    const json = await response.json();
    console.log("json file : ", json.errors, json.success);

    if (!json.success) {
      setError(json.errors.email || "ENTER VALID CREDENTIALS!!!!");
    } else if(json.success) {
      if(credentials.isAdmin && json.success){
      localStorage.setItem("adminEmail", credentials.email);
      localStorage.setItem("adminToken", json.authToken);
      Navigate("/admin-dash");
      } else{
      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem("authToken", json.authToken);
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
    <>
      <div className="container login">
        <form onSubmit={handleSubmit}>
          {/* Display error messages */}
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={credentials.name}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
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
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              name="geolocation"
              value={credentials.geolocation}
              onChange={onChange}
            />
          </div>
          {/* Option to set admin user */}
          <div className="mb-3">
            {/* <input
              type="checkbox"
              name="isAdmin"
              checked={credentials.isAdmin}
              onChange={(e) =>
                setCredentials({ ...credentials, isAdmin: e.target.checked })
              }
            /> */}
            {/* <label className="form-label">Create Admin?</label> */}
          </div>

          <button type="submit" className="btn btn-warning ">
            Submit
          </button>
          <button type="" className="btn btn-success" onClick={loginUser}>
            Already a user
          </button>
        </form>
      </div>
    </>
  );
}
