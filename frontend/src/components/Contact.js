import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Contact = () => {
  return (
    <div>
      <div className="testimonial">
        <div className="small-container">
          <div className="row">
            <div className="col-3">
              <i className="fa fa-quote-left"></i>
              <p>
                I have done my Under Graduation in Computer Science and
                Engineering from Heritage Institute of Technology Kolkata . I am
                here to give my best for the platform.
              </p>

              <img src="images/gaurav.jpg" />
              <h3>Gaurav Mishra</h3>
            </div>
            <div className="col-3">
              <i className="fa fa-quote-left"></i>
              <p>
                Your Brand is what other people say about you when you're not in
                the room. I want every customer to feel like a family while
                shopping with us!
              </p>

              <img src="images/bishal.jpg" />
              <h3>Bishal Das</h3>
            </div>
            <div className="col-3">
              <i className="fa fa-quote-left"></i>
              <p>
                {" "}
                Great companies are built on great products. I am a 4th Year
                student and i believe i would offer better products to the
                community as cheaply as possible.
              </p>

              <img src="images/arnab.jpg" />
              <h3>Arnab Roy</h3>
            </div>
            <div className="col-3">
              <i className="fa fa-quote-left"></i>
              <p>
                If you want people to buy your products, your products have to
                become a part of their environment. I am always here to help.
                Feel free to contact me.
              </p>

              <img src="images/ashish.jpg" />
              <h3>Ashish Kumar</h3>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
