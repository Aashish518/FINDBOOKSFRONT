import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import "../pages-css/MyOrders.css";
import { ProfileMenu } from "../components/ProfileMenu";
import { Package, Calendar, CreditCard, Truck } from "lucide-react";
import Load from "../components/Load";
import { useAlert } from "../Context/AlertContext";
import { Linkurl } from "../components/Linkurl";
const backlink = Linkurl();
import Cookies from 'js-cookie';
const token = Cookies.get("token");

export const MyOrders = () => {
  const [order, setOrder] = useState([]);
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();
  const [returnmessage, setReturnmessage] = useState("");
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await fetch(`${backlink}/api/Order`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        const json = await response.json();
        const newOrders = Array.isArray(json.orders) ? json.orders : [];
        const newBooks = Array.isArray(json.books) ? json.books : [];
        setOrder(newOrders);
        setBook(newBooks);
        setUser(jsonuserId)
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    
    if (newStatus === "Cancelled") {
      orderId.books.map((books)=>{books.user_id})
      try {
        const response = await fetch(`${backlink}/api/${newStatus}/SellOrders`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },          body: JSON.stringify({ resellerid: resellerid, bookid: booksdetail._id }),
          credentials: 'include',
        });


        if (response.ok) {
          addpaymentdata();
        }
        setDeliveryCompleted(true);

      } catch (error) {
        console.error("Error fetching Sell Order data:", error);
      }
    }
    try {
      const response = await fetch(
        `${backlink}/api/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update local state only after successful API call
      setOrder((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, Order_Status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      showAlert("Failed to update order status. Please try again.", "error");
    }
    if (newStatus === "Return") {
      setReturnmessage("your order return , received in 2 day");
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    return `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj.getFullYear()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return "status-shipped";
      case "Pending":
        return "status-pending";
      case "Cancelled":
        return "status-cancelled";
      case "Delivered":
        return "status-delivered";
      default:
        return "status-default";
    }
  };

  if (loading) {
    return <Load />;
  }

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <ProfileMenu />
        <div className="orders-page">
          <div className="orders-header">
            <h1>My Orders</h1>
            <p className="orders-subtitle">Track and manage your orders</p>
          </div>
          <div className="orders-list">
            {order.length > 0 ? (
              order
                .slice()
                .reverse()
                .map((orderItem) => (
                  <div key={orderItem._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-date">
                          <Calendar size={20} />
                          <span>{formatDate(orderItem.Order_Date)}</span>
                        </div>
                        <div className="order-amount">
                          <CreditCard size={20} />
                          <span>₹{orderItem.Total_Amount}</span>
                        </div>
                      </div>
                      <div className={`order-status ${getStatusColor(orderItem.Order_Status)}`}>
                        <Truck size={20} />
                        <span>{orderItem.Order_Status}</span>
                      </div>
                    </div>
                    <div className="order-books">
                      <h3>Ordered Books : {orderItem.books.length}</h3>
                      <div className="book-list">
                        {book
                          .filter(
                            (bookItem, index, self) =>
                              orderItem.books.some(
                                (orderBook) => orderBook.book_id === bookItem._id
                              ) &&
                              index ===
                              self.findIndex((b) => b._id === bookItem._id)
                          )
                          .map((bookItem) => {
                            const matchedBook = orderItem.books.find(
                              (orderBook) => orderBook.book_id === bookItem._id
                            );

                            return (
                              <div key={bookItem._id} className="book-card">
                                <div className="book-image">
                                  <img
                                    src={`${backlink}/${bookItem.BookImageURL}`}
                                    alt={bookItem.BookName}
                                  />
                                </div>
                                <div className="book-details">
                                  <h4>{bookItem.BookName}</h4>
                                  <p className="book-price">₹{bookItem.Price}</p>
                                  {matchedBook && (
                                    <p className="book-quantity">
                                      Quantity: {matchedBook.book_quantity}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {orderItem.Order_Status === "Cancelled" || orderItem.Order_Status === "Shipped" || orderItem.Order_Status === "Delivered" || orderItem.Order_Status === "Return" ? "" :
                      <button
                        onClick={() => updateOrderStatus(orderItem._id, "Cancelled")}
                      >
                        Cancel Order
                      </button>}
                    
                    {
                      (
                        orderItem.books.every(bookdata => {
                          const matchedBook = book.find(b => b._id === bookdata.book_id);
                          return matchedBook?.Isoldbook === false;
                        }) &&
                        !["Cancelled", "Shipped", "Pending", "Return"].includes(orderItem.Order_Status)
                      ) ? (
                        <button onClick={() => updateOrderStatus(orderItem._id, "Return")}>
                          Return Order
                        </button>
                      ) : ""
                    }

                    <h2 color="red">{returnmessage}</h2>
                  </div>
                ))
            ) : (
              <div className="no-orders">
                <Package size={48} />
                <h2>No Orders Yet</h2>
                <p>Start shopping to see your orders here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
