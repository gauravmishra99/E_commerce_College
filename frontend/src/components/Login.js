import React, { useContext, useState } from "react";
import bodyImage from "../images/4.png";
import { UserContext } from "./Context/UserContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
const Login = () => {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customer, setCustomer] = useState(true);

  const { authValue, userValue, loginValue, sellerLogin } =
    useContext(UserContext);
  const [authToken, setAuthToken] = authValue;
  const [user, setUser] = userValue;
  const [isLoggedIn, setIsLoggedIn] = loginValue;
  const [sellerLoggedIn, setSellerLoggedIn] = sellerLogin;

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const customerUrl = "/users/customers/login";
    const sellerUrl = "/users/seller/login";
    const url = customer === true ? customerUrl : sellerUrl;
    try {
      const response = await axios.post(url, {
        email,
        password,
      });
      setEmail("");
      setPassword("");
      {
        customer
          ? setUser(response.data.customer)
          : setUser(response.data.seller);
      }
      setAuthToken(response.data.token);
      {
        customer
          ? localStorage.setItem("user", "customer")
          : localStorage.setItem("user", "seller");
      }
      {
        customer ? history.push("/products") : history.push("/items");
      }

      {
        customer ? setIsLoggedIn(true) : setSellerLoggedIn(true);
      }
    } catch (error) {
      alert("Please check the credentials");
    }
  };
  const handleCustomer = () => {
    setCustomer(true);
  };
  const handleSeller = () => {
    setCustomer(false);
  };
  return (
    <div className="account-page">
      <div className="container">
        <div className="row">
          <div className="col-2">
            <img src={bodyImage} width="100%" />
          </div>
          <div className="col-2">
            <div className="form-container">
              <div className="form-btn">
                <span>Login</span>
                {/* <span onclick="register()">Register</span> */}
                {/* <hr id="Indicator" /> */}
              </div>
              <div className="form-btn1">
                <button
                  className={customer ? "btn-style" : null}
                  onClick={handleCustomer}
                >
                  Customer
                </button>
                <button
                  className={customer ? null : "btn-style"}
                  onClick={handleSeller}
                >
                  Seller
                </button>
              </div>

              <form id="LoginForm">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={handlePassword}
                  placeholder="Password"
                />
                <button type="Submit" className="btn" onClick={submitHandler}>
                  Login
                </button>
                <a href="">Forgot Password</a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
