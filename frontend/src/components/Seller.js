import React from "react";
import Dashboard from "./Dashboard";
import Items from "./Items";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Contact from "./Contact";
import Additems from "./Additems";
import Footer from "./Footer";
import ViewOrders from "./ViewOrders";
import EditItem from "./EditItem";

const Seller = () => {
  return (
    <div>
      <Dashboard />
      <Switch>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/items">
          <Items />
        </Route>
        <Route path="/additems">
          <Additems />
        </Route>
        <Route path="/viewOrders">
          <ViewOrders />
        </Route>
        <Route path="/editItems/:id">
          <EditItem />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

export default Seller;
