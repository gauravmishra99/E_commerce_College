import React from "react";
import bodyImage from "../images/4.png";

const Homebody = () => {
  return (
    <div className="row">
      <div className="col-2">
        <h1>
          Buy anything you want
          <br />
          At unbelievable price!
        </h1>
        <p>
          “Amazing things will happen when
          <br /> you listen to the consumer.” –Jonathan Midenhall, CMO of Airbnb
        </p>
      </div>

      <div className="col-2">
        <img src={bodyImage} />
      </div>
    </div>
  );
};

export default Homebody;
