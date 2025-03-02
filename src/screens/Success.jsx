import React, { useEffect } from "react";
import { Link,useNavigate } from 'react-router-dom'

const Success = () => {
const Navigate = useNavigate()
  const Back = () => {
    localStorage.removeItem("cartData")
    Navigate('/')
  }
  useEffect(() => {
    const saveOrder = async () => {
      const userEmail = localStorage.getItem("userEmail"); // Get email from localStorage
      
      // Check if email is available
      if (!userEmail) {
        console.log("No user email found in localStorage.");
        return;
      }
  
      // Get the cart data from localStorage (assuming cart data is stored here as JSON)
      const cartData = JSON.parse(localStorage.getItem("cartData")); // Retrieve cart data
      console.log("cartData from localStorage:", cartData);      
  
      // Modify this to ensure all relevant data is passed
      const filteredCartData = cartData.map(item => ({
        name: item.name,  // Ensure name is included
        qty: item.qty,    // Ensure qty is included
        price: item.price, // Ensure price is included
      }));
  
      if (filteredCartData.length === 0) {
        console.error("No valid cart data to send.");
        return;
      }
      
      console.log("filtered cart data", filteredCartData);
      
      // Send the valid data
      const orderData = {
        email: userEmail,
        order_data: filteredCartData,  // Send the full order data with all necessary details
      };
  
      // Log the orderData object to see what is being sent
      console.log("Order Data being sent:", orderData);
  
      try {
        const response = await fetch("http://localhost:5000/api/saveOrderAfterPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });
  
        const data = await response.json();
        if (data.success) {
          console.log("Order saved successfully!!!!");
          console.log("Final order data to save:", data);
        } else {
          console.log("Failed to save order");
        }
      } catch (error) {
        console.error("Error saving order:", error);
      }
    };
  
    saveOrder();
  }, []);
  

  return (
     <div className='centered-container'>
     <div className="row justify-content-center">
       <div className="col-md-5">
         <div className="message-box _success">
           <i className="fa fa-times-circle" aria-hidden="true"></i>
           <h1>Payment Successful</h1>
           <p>Your order has been successfully placed and saved.</p>
           <div className="btn bg-success text-white mx-1" onClick={Back}>
      Back
    </div>
         </div>
       </div>
     </div>
   </div>

  );
};

export default Success;
