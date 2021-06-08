import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Homebody from "./Homebody";
import Contact from "./Contact";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Homepage = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/">
          <Homebody />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

export default Homepage;
