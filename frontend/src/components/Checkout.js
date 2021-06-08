import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Checkout = () => {
  let history = useHistory();
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    getItemInCart();
  }, []);

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  const displayRazorpay = async (server_order) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // creating a new order
    const result = await axios.post("/payment/orders", { totalAmount });
    if (!result) {
      alert("Server error. Are you online?");
      return;
    }
    // Getting the order details back
    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_MurRbH80nJk9Wl", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Absolutely Anything.",
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post("/payment/success", data);
        const rpOrderId = result.data.orderId;
        const rpPaymentId = result.data.paymentId;
        const orderId = server_order._id;
        const popo = await axios.post("/saveRazorpaydetails", {
          rpOrderId,
          rpPaymentId,
          orderId,
        });
        await axios.post("/clearCart");
        await axios.post("/addOrder", { orderId });
        alert("Order placed Successfully");
        history.push({
          pathname: "/products",
        });
      },
      modal: {
        ondismiss: async function () {
          console.log("hum yahan aaya");
          axios.post("/restoreOrder", { server_order });
        },
      },
      prefill: {
        name: "Gaurav Mishra",
        email: "g@gmail.com",
        contact: "9113326464",
      },
      notes: {
        address: "Soumya Dey Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", (response) => {
      axios.post("/restoreOrder", { server_order });
    });
    // paymentObject.close();
  };

  const getItemInCart = async () => {
    const response = await axios.get("/getItemsInCart");
    let amount = 0;
    response.data.map((item) => {
      amount += item.quantity * item.item[0].price;
    });
    setTotalAmount(amount);
    setCart(response.data);
  };

  const [firstName, setFirstName] = useState("");
  const [addressFirst, setAddressFirst] = useState("");
  const [addressSecond, setAddressSecond] = useState("");
  const [town, setTown] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [tfirstName, setTfirstName] = useState(false);
  const [efirstName, setEfirstName] = useState(false);

  const [taddressF, setTaddressF] = useState(false);
  const [eaddressF, setEaddressF] = useState(false);

  const [taddressS, setTaddressS] = useState(false);
  const [eaddressS, setEaddressS] = useState(false);

  const [tTown, setTTown] = useState(false);
  const [eTown, setEtown] = useState(false);

  const [tState, setTstate] = useState(false);
  const [eState, setEstate] = useState(false);

  const [tPin, setTpin] = useState(false);
  const [ePin, setEpin] = useState(false);

  const [tphonenumber, setTphonenumber] = useState(false);
  const [ephonenumber, setEphonenumber] = useState(false);

  const [temail, setTemail] = useState(false);
  const [eEmail, setEemail] = useState(false);

  const handleName = (e) => {
    setEfirstName(false);
    setFirstName(e.target.value);
    setTfirstName(true);
  };
  const handleNameBlur = (e) => {
    if (firstName === "") {
      setEfirstName("Field cannot be empty");
    }
  };

  const handleAddressf = (e) => {
    setEaddressF(false);
    setAddressFirst(e.target.value);
    setTaddressF(true);
  };
  const handleAddressfBlur = (e) => {
    if (addressFirst === "") {
      setEaddressF("Field cannot be empty");
    }
  };

  const handleAddressS = (e) => {
    setEaddressS(false);
    setAddressSecond(e.target.value);
    setTaddressF(true);
  };
  const handleAddressSBlur = () => {
    if (addressSecond === "") {
      setEaddressS("Field cannot be empty");
    }
  };

  const handleTown = (e) => {
    setEtown(false);
    setTown(e.target.value);
    setTTown(true);
  };
  const handleTownBlur = () => {
    if (town === "") {
      setEtown("Field cannot be empty");
    }
  };

  const handleState = (e) => {
    setEstate(false);
    setState(e.target.value);
    setTstate(true);
  };
  const handleStateBlur = () => {
    if (state === "") {
      setEstate("Field cannot be empty");
    }
  };

  const handlePin = (e) => {
    setEpin(false);
    setPin(e.target.value);
    setTpin(true);
  };
  const handlePinBlur = () => {
    if (pin === "") {
      setEpin("Field Cannot be empty");
    }
  };

  const handlePhone = (e) => {
    setEphonenumber(false);
    setPhone(e.target.value);
    setTphonenumber(true);
  };
  const handlePhoneBlur = (e) => {
    if (phoneNumber === "") {
      setEphonenumber("Field cannot be empty");
    }
  };

  const handleEmail = (e) => {
    setEemail(false);
    setEmail(e.target.value);
    setTemail(true);
  };
  const handleEmailBlur = () => {
    if (email === "") {
      setEemail("Field cannot be empty");
    }
  };

  const handleCheckout = async (e) => {
    const address = addressFirst + " " + addressSecond;
    const response = await axios.post("/users/customers/checkout", {
      firstName,
      address,
      town,
      state,
      pin,
      phoneNumber,
      email,
    });
    displayRazorpay(response.data);
  };

  return (
    <div className="container-checkout">
      <div className="title-checkout">
        <h2>Product Order Form</h2>
      </div>
      <div className="d-flex">
        <form className="checkout-form">
          <label>
            <span className="fname">
              First Name <span className="required">*</span>
            </span>
            <input
              required
              type="text"
              name="fname"
              value={firstName}
              onFocus={() => setTfirstName(true)}
              onChange={handleName}
              onBlur={handleNameBlur}
            />
            {tfirstName && efirstName && (
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "red",
                  float: "none",
                  minWidth: "100px",
                  marginTop: "0",
                  paddingRight: "0",
                  marginLeft: "11.5em",
                }}
              >
                {efirstName}
              </span>
            )}
          </label>
          <label>
            <span>
              Street Address <span className="required">*</span>
            </span>
            <input
              type="text"
              name="houseadd"
              placeholder="House number and street name"
              required
              value={addressFirst}
              onFocus={() => setTaddressF(true)}
              onChange={handleAddressf}
              onBlur={handleAddressfBlur}
            />
            {taddressF && eaddressF && (
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "red",
                  float: "none",
                  minWidth: "100px",
                  marginTop: "0",
                  paddingRight: "0",
                  marginLeft: "11.5em",
                }}
              >
                {eaddressF}
              </span>
            )}
          </label>
          <label>
            <span>&nbsp;</span>
            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, unit etc. (optional)"
              value={addressSecond}
              onFocus={() => setTaddressS(true)}
              onChange={handleAddressS}
              onBlur={handleAddressSBlur}
            />
            {taddressS && eaddressS && (
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "red",
                  float: "none",
                  width: "100px",
                  marginTop: "0",
                  paddingRight: "0",
                  marginLeft: "11.5em",
                }}
              >
                Field is required
              </span>
            )}
          </label>
          <label>
            <span>
              Town / City <span className="required">*</span>
            </span>
            <input
              value={town}
              onChange={handleTown}
              onBlur={handleTownBlur}
              onFocus={() => setTTown(true)}
              type="text"
              name="city"
            />
            {tTown && eTown && (
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "red",
                  float: "none",
                  width: "100px",
                  marginTop: "0",
                  paddingRight: "0",
                  marginLeft: "11.5em",
                }}
              >
                Field is required
              </span>
            )}
          </label>
          <label>
            <span>
              State / County <span className="required">*</span>
            </span>
            <input
              type="text"
              name="city"
              value={state}
              onFocus={() => setTstate(true)}
              onChange={handleState}
              onBlur={handleStateBlur}
            />
            {tState && eState && (
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "red",
                  float: "none",
                  width: "100px",
                  marginTop: "0",
                  paddingRight: "0",
                  marginLeft: "11.5em",
                }}
              >
                Field is required
              </span>
            )}
          </label>
          <label>
            <span>
              Postcode / ZIP <span className="required">*</span>
            </span>
            <input
              type="text"
              name="city"
              value={pin}
              onFocus={() => setTpin(true)}
              onChange={handlePin}
              onBlur={handlePinBlur}
            />
            {tPin && ePin && (
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "red",
                  float: "none",
                  width: "100px",
                  marginTop: "0",
                  paddingRight: "0",
                  marginLeft: "11.5em",
                }}
              >
                Field is required
              </span>
            )}
          </label>
          <label>
            <span>
              Phone <span className="required">*</span>
            </span>
            <input
              type="tel"
              name="city"
              value={phoneNumber}
              onFocus={() => setTphonenumber(true)}
              onChange={handlePhone}
              onBlur={handlePhoneBlur}
            />
            {tphonenumber && ephonenumber && (
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "red",
                  float: "none",
                  width: "100px",
                  marginTop: "0",
                  paddingRight: "0",
                  marginLeft: "11.5em",
                }}
              >
                Field is required
              </span>
            )}
          </label>
          <label>
            <span>
              Email Address <span className="required">*</span>
            </span>
            <input
              className="checkout-form-email"
              type="email"
              name="city"
              value={email}
              onFocus={() => setTemail(true)}
              onChange={handleEmail}
              onBlur={handleEmailBlur}
            />
            {temail && eEmail && (
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "red",
                  float: "none",
                  width: "100px",
                  marginTop: "0",
                  paddingRight: "0",
                  marginLeft: "11.5em",
                }}
              >
                Field is required
              </span>
            )}
          </label>
        </form>
        <div className="Yorder">
          <table>
            <tbody>
              <tr>
                <th className="Yorder-header" colSpan="2">
                  Your order
                </th>
              </tr>
              {cart.map((item) => {
                return (
                  <tr key={item.item[0]._id}>
                    {/* <td>
                        <img
                          style={{ width: "25px", height: "25px" }}
                          src={url}
                        />
                      </td> */}
                    <td className="Yorder-td">
                      {item.item[0].itemname} x {item.quantity} (Qty)
                    </td>
                    <td className="Yorder-td">
                      {item.item[0].price * item.quantity}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="Yorder-td">Subtotal</td>
                <td className="Yorder-td">{totalAmount}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <button
            onClick={handleCheckout}
            className="checkout-btn"
            type="button"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
