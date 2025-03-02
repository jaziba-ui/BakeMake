import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleBack = () => {
    localStorage.removeItem("cartData"); // Clear localStorage
    navigate("/"); // Navigate to home
  };

  return (
    <div className="centered-container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="message-box _success _failed">
            <i className="fa fa-times-circle" aria-hidden="true"></i>
            <h2>Your payment failed</h2>
            <p>Try again later</p>
            <div className="btn bg-danger text-white mx-1" onClick={handleBack}>
              Back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
