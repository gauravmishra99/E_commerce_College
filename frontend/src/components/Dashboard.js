import React, { useContext } from "react";
import "../App.css";
import logo from "../images/anything1.jpeg";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Contact from "./Contact";
import Products from "./Products";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import { UserContext } from "./Context/UserContext";
import App from "../App";
import axios from "axios";

const Dashboard = () => {
  let history = useHistory();
  const { authValue, userValue, loginValue, sellerLogin } =
    useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = loginValue;
  const [sellerLoggedIn, setSellerLoggedIn] = sellerLogin;

  const handleLogout = async () => {
    const customerUrl = "/users/customers/logout";
    const sellerUrl = "/users/seller/logout";
    let url = "";
    if (isLoggedIn) {
      url = customerUrl;
    } else {
      url = sellerUrl;
    }
    await axios.post(url, {
      message: "you were Logged out!",
    });

    history.push("/");
    {
      isLoggedIn ? setIsLoggedIn(false) : setSellerLoggedIn(false);
    }
  };
  return (
    <div className="header">
      <div className="navbar">
        <div className="logo">
          <a>
            <img src={logo} alt="logo" width="100px" />
          </a>
        </div>
        <nav>
          <ul id="MenuItems">
            {isLoggedIn ? (
              <li>
                <Link to="/products">Products</Link>
              </li>
            ) : (
              <li>
                <Link to="/items">Items</Link>
              </li>
            )}

            <li>
              <Link to="/contact">Contact</Link>
            </li>
            {sellerLoggedIn && (
              <li>
                <Link to="/additems">Add Items</Link>
              </li>
            )}
            {sellerLoggedIn && (
              <li>
                <Link to="/viewOrders">View Orders</Link>
              </li>
            )}
          </ul>
        </nav>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
        {isLoggedIn && (
          <Link to="/cart">
            <ShoppingCartIcon />
          </Link>
        )}
        {/* <a href="/cart"></a> */}
      </div>
    </div>
  );
};

export default Dashboard;
