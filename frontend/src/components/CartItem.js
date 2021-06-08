import axios from "axios";
import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const CartItem = ({ item, quantity, getItemInCart }) => {
  const [quan, setQuan] = useState(quantity);
  useEffect(() => {
    getItemInCart();
  }, [quan]);
  const handleIncrease = async () => {
    const change = 1;

    const res = await axios.post("/items/incre-decrement-quantity", {
      id: item.item[0]._id,
      change,
    });
    if (res.status === 201) {
      setQuan(quan + 1);
    }
  };
  const handleDecrease = async () => {
    const change = -1;
    if (quan === 1) {
      alert("Are you sure you want to remove this item?");
      handleRemoveItem();
      return;
    }
    const res = await axios.post("/items/incre-decrement-quantity", {
      id: item.item[0]._id,
      change,
    });
    if (res.status === 201) {
      setQuan(quan - 1);
    }
  };
  const handleQuantity = async (e) => {
    const newValue = parseInt(e.target.value);
    if (e.target.value === "") {
      setQuan("");
      return;
    }
    if (isNaN(newValue)) {
      alert("Enter a numerical value in quantity!");
      return;
    }
    if (newValue < 0) {
      alert("Enter a value greater than or equal than 0");
      return;
    }
    const res = await axios.post("/items/change-quantity", {
      id: item.item[0]._id,
      newValue,
    });
    if (res.status === 201) {
      setQuan(newValue);
    }
  };
  const handleRemoveItem = async (e) => {
    const res = await axios.post("/removeItemInCart", {
      id: item.item[0]._id,
    });
    getItemInCart();
  };
  const url = `http://localhost:5000/item/${item.item[0]._id}`;
  const price = quantity * item.item[0].price;
  return (
    <tr>
      <td>
        <div className="cart-info">
          <img src={url} />
          <div>
            <p>{item.item[0].itemname}</p>
            <small>Price: &#8360; {item.item[0].price}</small>
            <br />
            <a href="" onClick={handleRemoveItem}>
              Remove
            </a>
          </div>
        </div>
      </td>
      <td className="cart-quantity">
        <AddIcon
          style={{
            cursor: "pointer",
            border: "1px solid",
            borderRadius: "50%",
            padding: "1px",
          }}
          onClick={handleIncrease}
        />
        <input
          style={{ textAlign: "center" }}
          value={quan}
          onChange={handleQuantity}
        />
        <RemoveIcon
          style={{
            cursor: "pointer",
            border: "1px solid",
            borderRadius: "50%",
            padding: "1px",
          }}
          onClick={handleDecrease}
        />
      </td>
      <td>&#8360; {price}</td>
    </tr>
  );
};

export default CartItem;
