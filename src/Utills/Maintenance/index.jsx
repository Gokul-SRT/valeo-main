import React from "react";
import "./maintenance.css";
import logo1 from "../../assets/valeo.png";
import logo2 from "../../assets/SmartRun.png";

const Maintenance = ({ message }) => {
  return (
    <div className="maintenance-container">

      <div className="logo-row">
        <img src={logo2} alt="Logo 2" className="maintenance-logo" />
        <img src={logo1} alt="Logo 1" className="maintenance-logo pt-1" />
      </div>

     <h1>{message?.title||"We're Under Maintenance"}</h1>
      <p>
        {message?.description || "We are upgrading our system. Please try again later."}
      </p>

    </div>
  );
};

export default Maintenance;
