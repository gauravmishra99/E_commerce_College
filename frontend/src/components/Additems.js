import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Additems = ({
  names,
  prices,
  valuecs,
  detailss,
  stocks,
  returnPs,
  id,
}) => {
  let history = useHistory();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [valuec, setValuec] = useState("");
  const [details, setDetails] = useState("");
  const [stock, setStock] = useState("");
  const [returnP, setReturnP] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (names) {
      setName(names);
    }
    if (prices) {
      setPrice(prices);
    }
    if (valuecs) {
      setValuec(valuecs);
    }
    if (detailss) {
      setDetails(detailss);
    }
    if (stocks) {
      setStock(stocks);
    }
    if (returnPs) {
      setReturnP(returnPs);
    }
  }, [names]);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleValuec = (e) => {
    setValuec(e.target.value);
  };

  const handleDetail = (e) => {
    setDetails(e.target.value);
  };

  const handleStock = (e) => {
    setStock(e.target.value);
  };

  const handleReturn = (e) => {
    setReturnP(e.target.value);
  };

  const handleImage = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let tempPrice = parseInt(price);
      let tempStock = parseInt(stock);
      let tempReturn = parseInt(returnP);
      if (isNaN(tempPrice) || isNaN(tempStock) || isNaN(tempReturn)) {
        throw new Error("Enter numerical values in price and stock");
      }
      const data = new FormData();
      data.append("image", image);
      data.append("itemname", name);
      data.append("description", details);
      data.append("category", valuec);
      data.append("stock", tempStock);
      data.append("price", tempPrice);
      data.append("returnValid", tempReturn);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const response = await axios.post("/items", data, config);
      if (response.status === 201) {
        setName("");
        setDetails("");
        setPrice("");
        setReturnP("");
        setStock("");
        setValuec("Select Category");
        setImage("");
        alert("Item Created");
      }
    } catch (error) {
      setName("");
      setDetails("");
      setPrice("");
      setReturnP("");
      setStock("");
      setValuec("Select Category");
      setImage(null);
      alert(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      let tempPrice = parseInt(price);
      let tempStock = parseInt(stock);
      let tempReturn = parseInt(returnP);
      if (isNaN(tempPrice) || isNaN(tempStock) || isNaN(tempReturn)) {
        throw new Error("Enter numerical values in price and stock");
      }
      const data = new FormData();
      if (image !== null) {
        data.append("image", image);
      }
      data.append("itemname", name);
      data.append("description", details);
      data.append("category", valuec);
      data.append("stock", tempStock);
      data.append("price", tempPrice);
      data.append("returnValid", tempReturn);
      console.log(data);
      console.log(name);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const url = `/update/item/${id}`;
      const response = await axios.patch(url, {
        itemname: name,
        price,
        description: details,
        category: valuec,
        stock,
        returnValid: returnP,
      });
      if (response.status === 200) {
        setName("");
        setDetails("");
        setPrice("");
        setReturnP("");
        setStock("");
        setValuec("Select Category");
        setImage("");
        alert("Item Updated");
        history.push({
          pathname: "/items",
        });
      }
    } catch (error) {
      setName("");
      setDetails("");
      setPrice("");
      setReturnP("");
      setStock("");
      setValuec("Select Category");
      setImage(null);
      alert(error);
    }
  };

  return (
    <div>
      <div className="heading-additems">
        {names ? (
          <h1 id="head-additems">Edit the required value</h1>
        ) : (
          <h1 id="head-additems">
            Enter Details of the product you want to sell
          </h1>
        )}
        <h2 id="subheading-additems">Mention all the required details</h2>
      </div>
      <form className="form-additems" encType="multipart/form-data">
        <div className="form-additems-input">
          <label>Product Name: </label>

          <input
            type="text"
            name="name"
            value={name}
            onChange={handleName}
            placeholder="Enter Product name"
            className="box-additems"
          />
        </div>
        <div className="form-additems-input">
          <label>Price: </label>

          <input
            type="text"
            value={price}
            onChange={handlePrice}
            placeholder="Enter Product price"
            className="box-additems"
          />
        </div>
        <div className="form-additems-input">
          <label>Select Category: </label>

          <div id="option1-additems">
            <select value={valuec} onChange={handleValuec}>
              <option value="Select Category">Select Category</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Accessories">Accessories</option>
              <option value="Shoes">Shoes</option>
            </select>
          </div>
        </div>
        <div className="form-additems-input">
          <label id="head2-additems">Product Details</label>
          <input
            type="text"
            name="email"
            value={details}
            onChange={handleDetail}
            placeholder="Enter Product Description"
            className="box-additems"
          />
        </div>
        {!names && (
          <div className="form-additems-input">
            <label id="head2-additems"> Add Image:</label>
            <label
              style={{
                border: "1px solid black",
                background: "#fbeeee",
                padding: "5px",
                cursor: "pointer",
                textAlign: "center",
                borderRadius: "5px",
                marginRight: "5px",
              }}
              htmlFor="file-upload"
            >
              Upload Image
            </label>
            {image && <span>{image.name}</span>}
            <input
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              onChange={handleImage}
              name="image"
            />
          </div>
        )}

        <div className="form-additems-input">
          <label id="head2-additems"> Stock</label>

          <input
            type="text"
            name="email"
            value={stock}
            onChange={handleStock}
            placeholder="Enter Stock of Item"
            className="box-additems"
          />
        </div>
        <div className="form-additems-input">
          <label id="head2-additems">Return Period</label>
          <input
            type="text"
            name="email"
            value={returnP}
            onChange={handleReturn}
            placeholder="Return Period"
            className="box-additems"
          />
        </div>

        {names ? (
          <button onClick={handleEdit} className="btn-additems">
            <h3>Submit</h3>
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-additems">
            <h3>Submit</h3>
          </button>
        )}
      </form>
    </div>
  );
};

export default Additems;
