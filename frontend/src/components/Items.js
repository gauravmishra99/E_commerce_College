import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Item from "./Item";

const Items = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const response = await axios.get("/seller/items");
    if (response.status === 200) {
      setItems(response.data);
    }
    if (response.status === 500) {
      alert("Server Facing some issues, Please try after sometimes");
    }
  };
  return (
    <>
      {items.length === 0 ? (
        <div
          style={{ alignItems: "center", justifyContent: "center" }}
          className="small-container-product"
        >
          <p style={{ fontSize: "1.5rem" }}>
            Proceed to{" "}
            <li style={{ display: "contents" }}>
              <Link
                style={{ textDecoration: "underline", color: "blue" }}
                to="/additems"
              >
                Add Items
              </Link>
            </li>{" "}
            to view here.
          </p>
        </div>
      ) : (
        <div style={{ alignItems: "center" }} className="small-container-product">
          {items.map((item) => {
            return <Item key={item._id} item={item} />;
          })}
        </div>
      )}
    </>
  );
};

export default Items;
