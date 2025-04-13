import React, { useState, useEffect } from "react";
import "../pages-css/DeliveryDashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AdminContext";
import Load from "../components/Load";
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

const DeliverypersonRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
      return (
        <div>
          <Load />
        </div>
      );
    }
  
  if (!user) {
      window.location.reload();
  } else {
      return children;
    };
  }

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState([]);
  const [payment, setPayment] = useState([]);
  const [deliveryperson, setDeliveryperson] = useState(null);
  const [activeSection, setActiveSection] = useState("completedDeliveries");
  const [reseller, setReseller] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reselluser, setReselluser] = useState([]);

  const { showAlert } = useAlert();

  const navigate = useNavigate();

  const updateStatus = (order) => {
    navigate("/deliverydashboard/deliverydetail", {
      state: { order, user, payment },
    });
  };
  const resellupdateStatus = (resellerdata) => {
    navigate("/deliverydashboard/reselldeliverydetail", {
      state: { resellerdata, books, reselluser },
    });
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch("${BASE_URL}/api/Orders", {
          credentials: "include",
        });
        const json = await response.json();
        setOrders(json.orders || []);
        setUser(json.user || []);
        setPayment(json.payment || []);
        setDeliveryperson(json.delivery);
      } catch (error) {
        showAlert("An error occurred. Please try again later.","error");
        console.error(error);
      }
    };

    const getSellOrder = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/SellOrder`, {
          credentials: "include",
        });
        const json = await response.json();
        setBooks(Array.isArray(json.books) ? json.books : []);
        setReseller(Array.isArray(json.reseller) ? json.reseller : []);
        setReselluser(Array.isArray(json.users) ? json.users : []);
        setDeliveryperson(json.delivery);
      } catch (error) {
        console.error("Error fetching SellOrder data:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
    getSellOrder();
  }, []);

  const sectionFilters = {
    completedDeliveries: orders.filter(
      (order) =>
        order.Order_Status === "Delivered" &&
        order.Delivery_User_id === deliveryperson
    ),
    completedBookCollected: reseller.filter(
      (order) => order.Resell_Status === "Collected" &&
        order.Delivery_User_id === deliveryperson
    ),
    pendingDeliveries: orders.filter(
      (order) => order.Order_Status === "Shipped"
    ),
    pendingBookCollection: reseller.filter(
      (order) => order.Resell_Status === "Sell"
    ),
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Delivery Dashboard</h1>
      <div className="stats-container">
        {Object.keys(sectionFilters).map((section) => (
          <p
            key={section}
            className={activeSection === section ? "active" : ""}
            onClick={() => setActiveSection(section)}
          >
            {section.replace(/([A-Z])/g, " $1").trim()}
          </p>
        ))}
      </div>
      <div className="totalorders-container">
        <h2 className="orders-title">
          {activeSection.replace(/([A-Z])/g, " $1").trim()}
        </h2>
        <table className="orders-table">
          <thead>
            <tr>
              {activeSection === "pendingBookCollection" ||
              activeSection === "completedBookCollected" ? (
                <>
                  <th>User Id</th>
                  <th>Reseller Address</th>
                  <th>Resell Status</th>
                  {activeSection.includes("pending") && <th>Actions</th>}
                </>
              ) : (
                <>
                  <th>Order Id :</th>
                  <th>Delivery Address</th>
                  <th>Status</th>
                  <th>Amount</th>
                  {activeSection.includes("pending") && <th>Actions</th>}
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sectionFilters[activeSection].map((item) => (
              <tr key={item._id}>
                {activeSection === "pendingBookCollection" ||
                activeSection === "completedBookCollected" ? (
                  <>
<td>{typeof item.User_id === 'object' ? `${item.User_id.First_name} ${item.User_id.Last_name}` : item.User_id}</td>
                    <td>{item.address}</td>
                    <td>{item.Resell_Status}</td>
                    {activeSection.includes("pending") && (
                      <td>
                        <button
                          onClick={() => resellupdateStatus(item)}
                          className="action-button yellow"
                        >
                          Start
                        </button>
                      </td>
                    )}
                  </>
                ) : (
                  <>
                    <td>{item._id}</td>
                    <td>{item.Address}</td>
                    <td>{item.Order_Status}</td>
                    <td>${item.Total_Amount}</td>
                    {activeSection.includes("pending") && (
                      <td>
                        <button
                          onClick={() => updateStatus(item)}
                          className="action-button yellow"
                        >
                          Start Delivery
                        </button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { DeliveryDashboard, DeliverypersonRoute };
