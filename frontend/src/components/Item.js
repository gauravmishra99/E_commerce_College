import React from "react";
import glasses from "../images/product1.jpg";
import { useHistory } from "react-router-dom";
const Item = ({ item }) => {
  let history = useHistory();
  const url = `http://localhost:5000/item/${item._id}`;
  const pathUrl = `/editItems/${item._id}`;

  const handleClick = () => {
    history.push({
      pathname: pathUrl,
    });
  };
  return (
    <div className="row-product" onClick={handleClick}>
      <div className="col-4">
        <a>
          <img src={url} />
        </a>
        <h4>{item.itemname}</h4>
        <div className="rating">
          {/* <span>
            <i className="fa fa-star"></i>
          </span>
          <span>
            <i className="fa fa-star"></i>
          </span>
          <span>
            <i className="fa fa-star"></i>
          </span>
          <span>
            <i className="fa fa-star"></i>
          </span>
          <span>
            <i className="fa fa-star"></i>
          </span> */}
        </div>
        <p>&#8360; {item.price}</p>
      </div>
    </div>
  );
};

export default Item;
