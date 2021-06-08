import React, { useContext } from "react";
import "../App.css";
import logo from "../images/anything1.jpeg";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Contact from "./Contact";
import Products from "./Products";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import { UserContext } from "./Context/UserContext";
import App from "../App";
import Homebody from "./Homebody";

const Header = () => {
  const { authValue, userValue, loginValue, sellerLogin } =
    useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = loginValue;
  const [sellerLoggedIn, setSellerLoggedIn] = sellerLogin;
  return (
    <div>
      <div className="header">
        <div className="navbar">
          <div className="logo">
            <a href="/">
              <img src={logo} alt="logo" width="100px" />
            </a>
          </div>
          <nav>
            <ul id="MenuItems">
              <li>
              <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </ul>
          </nav>
          {/* <Link to="/cart">
            <ShoppingCartIcon />
          </Link> */}
          
          {/* <a href="/cart"></a> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
