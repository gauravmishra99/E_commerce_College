import React from "react";
import logo from "../images/anything.jpeg";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <img style={{ width: "150px", height: "57px" }} src={logo} />
            <p>
              Our purpose is to fulfill the daily requirments of the community
              as cheaply as possible.
            </p>
          </div>
          <div>
            <h3>Follow us</h3>
            <div style={{ display: "flex", flexDirection:"column" }}>
              <a>Facebook</a>
              <a>Instagram</a>
              <a>YouTube</a>
              <a>Twitter</a>
            </div>
          </div>
        </div>
        <p className="copyright">Copyright 2021 - anything platform</p>
      </div>
    </div>
  );
};

export default Footer;
