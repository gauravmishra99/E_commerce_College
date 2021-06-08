import axios from "axios";
import React, { useEffect, useState } from "react";

const ViewOrders = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [orders, setOrders] = useState({});
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const response = await axios.post("/getOrders", { pageNumber });
    setOrders(response.data);
    const tempArray = [];
    for (const key in response.data) {
      tempArray.push(key);
    }
    setKeys(tempArray);
  };
  return (
    <div style={{ minHeight: "70vh", width: "100vw" }}>
      {/* <div style={{width:"100%"}}>
        <p>OrderId</p>
        <div style={{ display: "flex", flexDirection:"row", width:"100%", marginTop:"10px" }}>
          <div style={{width:"20%"}}>
            <img src="/" />
          </div>
          <div style={{display:"flex",width:"80%", justifyContent:"space-evenly"}}>
            <p>name</p>
            <p>status</p>
            <button>Change Status</button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ViewOrders;
