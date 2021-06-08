import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const DisplayProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const handleChange = (e) => {
    setQuantity(e.target.value);
  };
  const handleAddtoCart = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/addToCart", {
        item: location.state.item._id,
        quantity,
      });
      if (response.status === 500) {
        throw new Error("Server Error! Adding to Cart Unsuccessful");
      }
      alert("Added!");
    } catch (e) {
      alert(e);
    }
  };
  const url = `http://localhost:5000/item/${location.state.item._id}`;
  return (
    <div>
      <div className="small-container single-product">
        <div className="row">
          <div className="col-2">
            <img src={url} width="100%" id="ProductImg" />
          </div>
          <div className="col-2">
            <h1>{location.state.item.itemname}</h1>
            <h4>&#8360; {location.state.item.price}</h4>
            {/* <select>
              <option>select size</option>
              <option>XXL</option>
              <option>XL</option>
              <option>Large</option>
              <option>Medium</option>
              <option>Small</option>
            </select> */}
            <input type="number" value={quantity} onChange={handleChange} />
            <a href="" className="btn" onClick={handleAddtoCart}>
              Add To Cart
            </a>
            <h3>
              Product Details <i className="fa fa-indent"></i>
            </h3>
            <br />
            <p>{location.state.item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayProduct;
