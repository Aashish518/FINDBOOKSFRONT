import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages-css/AdminDashboard.css";
import { useViewOrder } from "../Context/OrderDetail";
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

export const AdminOrders = () => {
  const [bookdata, setBookdata] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const { setOrderDetails } = useViewOrder();
    const {showAlert} = useAlert();

  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/Orders`, {
          credentials: "include",
        });
        const json = await response.json();
        setOrders(json.orders);
      } catch (error) {
        showAlert("An error occurred. Please try again later.","error");
        console.error(error);
      }
    };

    getOrders();

    const GetUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/AllUser`, {
          credentials: "include",
        });
        const json = await response.json();
        setUsers(json.users); 
      } catch (error) {
        showAlert("An error occurred. Please try again later.","error");
        console.error(error);
      }
    };
    GetUsers();

    const fetchBook = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/Book`);
        const data = await res.json();
        setBookdata(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  }, []);

  const viewOrder = (orderdata, bookdata) => {
    const userdata = users.find((data) => data._id === orderdata.User_id);
    const filteredBooks = orderdata.books
      .map((bdata) => {
        const bookInfo = bookdata.find((data) => data._id === bdata.book_id);
        return bookInfo
          ? { ...bookInfo, book_quantity: bdata.book_quantity }
          : null;
      })
      .filter((book) => book !== null);

    setOrderDetails({ orderdata, userdata, bookdata: filteredBooks });
    navigate("/Admin/ViewOrder");
  };

  return (
    <section className="data-table">
      <h2>Completed Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders
            .filter((order) => {
              return (
                order.Order_Status.toLowerCase() === "cancelled" ||
                order.Order_Status.toLowerCase() === "delivered" ||
                order.Order_Status.toLowerCase() === "shipped"
              );
            })
            .map((order) => {
              const userDetail = users.find(
                (user) => user._id === order.User_id
              );
              const userName = userDetail
                ? `${userDetail.First_name} ${userDetail.Last_name}`
                : "Unknown User";

              return (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{userName}</td>
                  <td>{order.Order_Status}</td>
                  <td>{order.Total_Amount}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => viewOrder(order, bookdata)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
};
