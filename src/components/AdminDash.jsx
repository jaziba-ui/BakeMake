import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCart } from './ContextReducer';
import Order from '../screens/Order';
import AdminOrders from './AdminOrders';

const socket = io('http://localhost:5000', {
  transports: ['websocket','polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
console.log("Socket: ",socket)

socket.on("connect", () => {
  console.log("✅ Connected to server: ", socket.id);
  console.log(socket.connected);
});

socket.on('connect_error', (err) => {
  console.error('❌ Connection Error:', err);
});

socket.on("disconnect", (reason) => {
  console.error("❌ WebSocket Disconnected:", reason);
});



export default function AdminDash() {
  const [orders,setOrders] = useState([])
  const [cartView, setCartView] = useState(false);
  const [orderView, setOrderView] = useState(false);
  const [newOrder, setNewOrder] = useState(null); // To store the new order details
  const [reload, setReload] = useState(false); // To trigger re-fetching orders
  const Navigate = useNavigate();
  const data = useCart();

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log(`📡 Event received: ${event}`, args);
    });
  }, []);
  
  useEffect(() => {
    fetchOrders(); // Fetch orders when component mounts
}, []);


  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    Navigate('/create');
  };

  useEffect(() => {
    // Listen for "newOrder" event from backend
    socket.on('newOrder', (order) => {
      console.log("🛒 New Order Received!", order);
      setNewOrder(order); // Store new order details
      setReload(true); // Trigger reload to fetch new orders
    }); // Clean up when the component unmounts
    return () => {
      socket.off('newOrder');
    };

  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("Admin token missing! Redirecting...");
      Navigate("/login");
      return;
    }
    try {
      console.log("Admin Token Before Request:", localStorage.getItem("adminToken"));
      const response = await fetch('http://localhost:5000/api/orders',{ // Replace with your API endpoint
      method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("adminToken")}`  // Include token
            }

          })
          console.log(token)
          console.log("response: ",response) 
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }  
      const data = await response.json();
      setOrders(data.orders)
      console.log('Orders updated:', data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (reload) {
     setOrders((prevOrders) => [newOrder, ...prevOrders])
      setReload(false);
      fetchOrders()
    }
  }, [reload]);


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-warning bg-gradient ">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">BakeMake</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav me-auto mt-1">
              {/* Add any navigation links if required */}
            </ul>

            {(!localStorage.getItem("adminToken")) ? (
              <div className="d-flex">
                <Link className="btn bg-white text-warning mx-1" to="/login">Login</Link>
                <Link className="btn bg-white text-warning mx-1" to="/createuser">SignUp</Link>
              </div>
            ) : (
              <div>
                <div className="btn text-white mx-1 position-relative" onClick={() => { setCartView(true); }}>
                  <span className="position-absolute mt-2 ms-4 translate-middle badge rounded bg-danger">
                    {data.length}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                  </svg>
                </div>
                {cartView ? Navigate('/admin/orders') : null}

                <div className="btn bg-success text-white mx-1" onClick={handleLogout}>
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Show a notification when a new order arrives */}
      {newOrder && (
        <div className="notification">
          <strong>New Order Received!</strong> Order ID: {newOrder._id}
        </div>
      )}

      {/* Optionally, show the modal or trigger action */}
      {orderView ? <Modal onClose={() => { setOrderView(false); }}><Order /></Modal> : null}
    </div>
  );
}
