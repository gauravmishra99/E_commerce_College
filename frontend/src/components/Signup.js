import React, { useContext, useState } from "react";
import { UserContext } from "./Context/UserContext";
import axios from "axios";
import bodyImage from "../images/4.png";
import { useHistory } from "react-router-dom";

const Signup = () => {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [customer, setCustomer] = useState(true);
  const [phonenumber, setPhonenumber] = useState("");

  const { authValue, userValue, loginValue, sellerLogin } =
    useContext(UserContext);
  const [authToken, setAuthToken] = authValue;
  const [user, setUser] = userValue;
  const [isLoggedIn, setIsLoggedIn] = loginValue;
  const [sellerLoggedIn, setSellerLoggedIn] = sellerLogin;

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleNumber = (e) => {
    setNumber(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleAge = (e) => {
    setAge(e.target.value);
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
  };
  const handlePhonenumber = (e) => {
    setPhonenumber(e.target.value);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const customerUrl = "/users/customers";
    const sellerUrl = "/users/seller";
    const url = customer === true ? customerUrl : sellerUrl;
    let tempnumber = "";
    let tempage = "";
    try {
      if (customer) {
        tempnumber = parseInt(number);
        tempage = parseInt(age);

        if (isNaN(tempnumber) || isNaN(tempage)) {
          throw new Error("Please check the age and number field");
        }
        const response = await axios.post(url, {
          name: username,
          email,
          password,
          age: tempage,
          phonenumbers: tempnumber,
        });
        console.log(response);
        setUser(response.data.customer);
        setAuthToken(response.data.token);
      } else {
        tempnumber = parseInt(phonenumber);
        if (isNaN(tempnumber)) {
          throw new Error("Please check the Phone-number field");
        }
        const response = await axios.post(url, {
          name: username,
          email,
          password,
          phonenumber: tempnumber,
          address,
        });
        console.log(response);
        setUser(response.data.seller);
        setAuthToken(response.data.token);
      }
      setUsername("");
      setAge("");
      setEmail("");
      setPassword("");
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
      alert(error);
      setUsername("");
      setAge("");
      setEmail("");
      setPassword("");
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
            <div className="form-container-signup">
              <div className="form-btn">
                <span>Signup</span>
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

              {customer ? (
                <form id="LoginForm">
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsername}
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmail}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={number}
                    onChange={handleNumber}
                    placeholder="Mobile Number"
                  />
                  <input
                    type="text"
                    value={age}
                    onChange={handleAge}
                    placeholder="Age"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={handlePassword}
                    placeholder="Password"
                  />
                  <button type="Submit" className="btn" onClick={submitHandler}>
                    SignUp
                  </button>
                  <a href="">Forgot Password</a>
                </form>
              ) : (
                //signup for seller
                <form id="LoginForm">
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsername}
                    placeholder="Name"
                  />
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
                  <input
                    type="text"
                    value={address}
                    onChange={handleAddress}
                    placeholder="Enter Address"
                  />
                  <input
                    type="text"
                    value={phonenumber}
                    onChange={handlePhonenumber}
                    placeholder="Enter phone number"
                  />
                  <button type="Submit" className="btn" onClick={submitHandler}>
                    SignUp
                  </button>
                  <a href="">Forgot Password</a>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
