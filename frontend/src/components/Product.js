import React from "react";
import { useHistory } from "react-router-dom";
//use history

const Product = ({ item }) => {
  let history = useHistory();
  const handleClick = () => {
    history.push({
      pathname: "/display/product",
      state: { item: item },
    });
  };
  const url = `http://localhost:5000/item/${item._id}`;
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

export default Product;
