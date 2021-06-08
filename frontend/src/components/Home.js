import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./Context/UserContext";
import Dashboard from "./Dashboard";
import Contact from "./Contact";
import Products from "./Products";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DisplayProduct from "./DisplayProduct";
import Footer from "./Footer";
import Cart from "./Cart";
import Checkout from "./Checkout";

const Home = ({ isLoading, setIsLoading }) => {
  const { authValue, userValue, loginValue, sellerLogin } =
    useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = loginValue;
  const [sellerLoggedIn, setSellerLoggedIn] = sellerLogin;

  return (
    <div>
      <Dashboard />

      <Switch>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/products">
          <Products />
        </Route>
        <Route path="/display/product">
          <DisplayProduct />
        </Route>
        <Route path="/cart">
          <Cart/>
        </Route>
        <Route path="/checkout">
          <Checkout/>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

export default Home;
