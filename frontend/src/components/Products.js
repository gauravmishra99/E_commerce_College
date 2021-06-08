import axios from "axios";
import React, { useEffect, useState } from "react";
import Product from "./Product";

const Products = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const tempItems = await axios.get("/customer/items");
      if (!tempItems) {
        throw new Error({ error: "No Items Found" });
      }

      setItems(tempItems.data);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="small-container-product">
      {items.map((item) => {
        return <Product item={item} key={item._id} />;
      })}
    </div>
  );
};

export default Products;
