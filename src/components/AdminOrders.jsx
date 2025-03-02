import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const styles = {
  container: {
    padding: "24px",
    // maxWidth: "768px",
    margin: "0 auto",
    // backgroundColor: "#faf7f5",
    minHeight: "100vh",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#e39930", // Green color
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  backButtonHover: {
    backgroundColor: "#8a5408", // Darker green on hover
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    marginBottom: "12px",
    overflow: "hidden",
    border: "1px solid #e5e5e5",
  },
  orderHeader: {
    padding: "16px",
    cursor: "pointer",
    backgroundColor: "#faf7f5",
    transition: "background-color 0.2s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderHeaderHover: {
    backgroundColor: "#f5f5f4",
  },
  headerLeft: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  orderId: {
    color: "#4b5563",
  },
  userName: {
    fontWeight: "500",
    fontSize : "18px"
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "14px",
    fontWeight: "500",
  },
  expandedContent: {
    padding: "16px",
    backgroundColor: "white",
    borderTop: "1px solid #f3f4f6",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#000",
    marginBottom: "8px",
  },
  detailsContainer: {
    marginBottom: "16px",
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    // color: "#4b5563",
    marginBottom: "8px",
  },
  orderItem: {
    // color: "#4b5563",
    marginBottom: "4px",
  },
  orderItemNote: {
    color: "#9ca3af",
  },
  noOrders: {
    textAlign: "center",
    padding: "32px",
    color: "#6b7280",
  },
};


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [hoveredOrder, setHoveredOrder] = useState(null);
  
  const Navigate = useNavigate();
  const Back = () => {
    // localStorage.removeItem("authToken")
    Navigate("/admin-dash");
  };
    const handleLogout = () => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
      Navigate("/login");
    };
  
    useEffect(() => {
      const checkTokenExpiration = () => {
        const token = localStorage.getItem("adminToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            handleLogout(); // Auto logout on token expiration
          }
        }
      };
  
      checkTokenExpiration();
      const interval = setInterval(checkTokenExpiration, 60000); // Check every 1 minute
      return () => clearInterval(interval); // Cleanup
    }, []);


  const fetchOrders = async (token) => {
    console.log(localStorage.getItem("adminToken"));
    try {
      // const token = localStorage.getItem("adminToken");
      console.log("Fetching Orders with Token:", token);
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        cache: "no-cache",
      });
      console.log("Response Status:", response.status);
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.orders); // Log the orders to ensure status is correct
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error("Fetched data does not contain valid orders array");
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // console.log("Component Mounted")
  useEffect(() => {
    console.log("useEffect is running"); 
    const token = localStorage.getItem("adminToken");
    console.log("Admin Token Before Request:", token);
    if (!token) {
      alert("You Shouldnt be Here!!!!")
      Navigate("/")
      return;
    }
    fetchOrders(token);
  }, []);
  

  const OrderCard = ({ order }) => {
    const [status, setStatus] = useState(order.status || "waiting"); // Set default to "waiting" if status is null
    const [isExpanded, setIsExpanded] = useState(false); // Manage expanded state locally
  
    // Toggle status function
    const toggleStatus = async (orderId, currentStatus) => {
      const newStatus = currentStatus === "waiting" ? "completed" : "waiting"; 
  
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch("http://localhost:5000/api/update-order-status", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId, status: newStatus }),
        });
  
        const data = await response.json();
        if (data.success) {
          setStatus(newStatus); // Update status locally after successful update
        } else {
          console.error("Failed to update status");
        }
      } catch (error) {
        console.error("Error toggling status:", error);
      }
    };
  
    const handleOrderClick = () => {
      setIsExpanded(!isExpanded); // Toggle the expanded state on click
    };
  
    const buttonStyles = {
      backgroundColor: status === "waiting" ? "#ef4444" : "#4caf50",
      color: "white",
      padding: "4px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      border : "none"
    };
  
    return (
      <div style={styles.orderCard}>
        <div
          style={{
            ...styles.orderHeader,
            ...(isExpanded ? styles.orderHeaderHover : {}),
          }}
          onClick={handleOrderClick} // Only toggles the expanded state here
        >
          <div style={styles.headerLeft}>
            <span style={styles.orderId}>OD : {order.orderId}</span>
            <span style={styles.userName}>{order.userName}</span>
          </div>
          <div style={styles.headerRight}>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent expanding when clicking the button
                toggleStatus(order.orderId, status); // Toggle the order status
              }}
              style={buttonStyles}
            >
              {status === "waiting" ? "Waiting" : "Completed"}
            </button>
            {isExpanded ? (
              <ChevronUp size={20} color="#6b7280" />
            ) : (
              <ChevronDown size={20} color="#6b7280" />
            )}
          </div>
        </div>
  
        {isExpanded && (
          <div style={styles.expandedContent}>
            <div style={styles.detailsContainer}>
              <h3 style={styles.sectionTitle}>Customer Details</h3>
              <div>
                <div style={styles.detailRow}>
                  <span>{order.userLocation || "123 Main St, Apt 4B"}</span>
                </div>
              </div>
            </div>
  
            <div>
              <h3 style={styles.sectionTitle}>Order Items</h3>
              <div>
                {order.products?.map((product, index) => (
                  <div key={index} style={styles.orderItem}>
                    {product.quantity} {product.productName} - ${product.price * product.quantity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Admin Orders</h1>
        <div
          style={styles.backButton}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor =
              styles.backButtonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = styles.backButton.backgroundColor)
          }
          onClick={Back}
        >
          Back
        </div>
      </div>

      <div>
        {orders.length === 0 ? (
          <p style={styles.noOrders}>No orders found.</p>
        ) : (
          orders.map((order) => <OrderCard key={order.orderId} order={order} />)
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
