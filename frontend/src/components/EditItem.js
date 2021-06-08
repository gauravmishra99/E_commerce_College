import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Additems from "./Additems";

const EditItem = () => {
  const { id } = useParams();
  let history = useHistory();
  const [item, setItem] = useState([]);

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    const response = await axios.get(`/seller/items/${id}`);
    setItem(response.data);
  };

  const handleDeleteItem = async () => {
    const url = `/item/delete/${id}`;
    const response = await axios.delete(url);
    if (response.status === 200) {
      alert("Item Deleted");
    }
    history.push("/items");
  };
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Additems
        names={item.itemname}
        prices={item.price}
        valuecs={item.category}
        detailss={item.description}
        stocks={item.stock}
        returnPs={item.returnValid}
        id={id}
      />

      <div style={{ width: "16vw", marginBottom: "10px" }}>
        <a
          style={{
            border: "1px solid red",
            textAlign: "center",
            padding: "9px",
            background: "red",
            color: "black",
            cursor: "pointer",
          }}
          onClick={handleDeleteItem}
        >
          Delete Item
        </a>
      </div>
    </div>
  );
};

export default EditItem;
