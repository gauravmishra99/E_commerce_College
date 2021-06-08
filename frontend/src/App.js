import Header from "./components/Header";
import React, { useContext, useEffect, useState } from "react";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Homepage from "./components/Homepage";
import { UserContext } from "./components/Context/UserContext";
import axios from "axios";
import Seller from "./components/Seller";

function App() {
  const { authValue, userValue, loginValue, sellerLogin } =
    useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = loginValue;
  const [sellerLoggedIn, setSellerLoggedIn] = sellerLogin;
  const [isLoading, setIsLoading] = useState(true);

  const DecodeJWT = async () => {
    const tempUser = localStorage.getItem("user");
    try {
      let url = "http://localhost:5000/users/customers/decode";
      if (tempUser === "customer" || tempUser === "seller") {
        if (tempUser === "customer") {
          url = "/users/customers/decode";
          const response = await axios.post(url);
          if (response.data === true) {
            setTimeout(() => {
              setIsLoggedIn(true);
              setIsLoading(false);
            }, 500);
          } else {
            setIsLoggedIn(false);
            setIsLoading(false);
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        } else {
          url = "/users/seller/decode";
          const response = await axios.post(url);
          if (response.data === true) {
            setSellerLoggedIn(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          } else {
            setSellerLoggedIn(false);
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        }
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    } catch (error) {
      localStorage.removeItem('user')
      setIsLoggedIn(false);
      setSellerLoggedIn(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    DecodeJWT();
  }, []);

  return (
    <Router>
      <div className="App">
        {isLoading ? (
          <div className="loading">
            <h1>Loading....</h1>
          </div>
        ) : (
          <div>
            {isLoggedIn && (
              <Home isLoading={isLoading} setIsLoading={setIsLoading} />
            )}
            {sellerLoggedIn && <Seller/>}
            {!isLoggedIn && !sellerLoggedIn && <Homepage />}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
