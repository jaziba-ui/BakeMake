import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import Cart from "../screens/Cart";
import { useCart } from "./ContextReducer";
import Order from "../screens/Order";
import { jwtDecode } from 'jwt-decode';

// import Badge from 'react-bootstrap/Badge'

export default function Navbar() {
  const [cartView, setCartView] = useState(false);
  const [orderView, setOrderView] = useState(false);
  const Navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    Navigate("/create");
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          handleLogout(); // Auto logout on token expiration
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Check every 1 minute
    return () => clearInterval(interval); // Cleanup
  }, []);
  let data = useCart();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-warning bg-gradient ">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">
            BakeMake
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav me-auto mt-1">
              {/* <li>
        <Link className="nav-link active fs-5 text-white " aria-current="page" to="/">Home</Link>
        </li> */}
              {/* {(localStorage.getItem("authToken")) ? 
       <li>
       <Link className="nav-link active fs-5 " aria-current="page" to="/"
       onClick={() => {setOrderView(true)}}
       >My Orders</Link>
       </li>


       : " "}  */}
              {/* {orderView ? <Modal onClose={() => {setOrderView(false)}}> <Order/> </Modal> : null} */}
            </ul>
            {!localStorage.getItem("authToken") ? (
              <div className="d-flex">
                <Link className="btn bg-white text-warning mx-1" to="/login">
                  Login
                </Link>
                <Link className="btn bg-white text-warning mx-1" to="/create">
                  SignUp
                </Link>
              </div>
            ) : (
              <div>
                <div
                  className="btn text-white mx-1 position-relative"
                  onClick={() => {
                    setCartView(true);
                  }}
                >
                  <span class="position-absolute mt-2 ms-4 translate-middle badge rounded bg-danger">
                    {data.length}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    class="bi bi-bag-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m0 6.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132" />
                  </svg>
                </div>
                {cartView ? (
                  <Modal
                    onClose={() => {
                      setCartView(false);
                    }}
                  >
                    {" "}
                    <Cart />{" "}
                  </Modal>
                ) : null}

                <div
                  className="btn bg-success text-white mx-1"
                  onClick={handleLogout}
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
