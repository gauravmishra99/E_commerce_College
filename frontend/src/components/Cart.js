import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CartItem from "./CartItem";

const Cart = () => {
  let history = useHistory();
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    getItemInCart();
  }, []);
  const getItemInCart = async () => {
    const response = await axios.get("/getItemsInCart");
    console.log(response)
    let amount = 0;
    response.data.map((item) => {
      amount += item.quantity * item.item[0].price;
    });
    setTotalAmount(amount);
    setCart(response.data);
  };

  const checkOut = async () => {
    history.push({
      pathname: "/checkout",
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      {cart.length === 0 ? (
        <p style={{ fontSize: "1.5rem", color: "#262626c9" }}>
          Cart is Empty! Please add items to view in cart
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="small-container-cart">
            <table>
              <tbody>
                <tr>
                  <th>Product</th>
                  <th className="cart-quantity-table">Quantity</th>
                  <th>Subtotal</th>
                </tr>
                {cart.map((item) => {
                  return (
                    <CartItem
                      key={item.item[0]._id}
                      item={item}
                      quantity={item.quantity}
                      getItemInCart={getItemInCart}
                    />
                  );
                })}
              </tbody>
            </table>
            <div className="total-price">
              <table>
                <tbody>
                  <tr>
                    <td>Total</td>
                    <td>&#8360; {totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              width: "90vw",
              marginBottom: "10px",
            }}
          >
            <button
              style={{ width: "140px", height: "32px" }}
              onClick={checkOut}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
