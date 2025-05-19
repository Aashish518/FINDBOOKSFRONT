import React, { useEffect, useState } from "react";
import "../pages-css/ViewPayment.css";

export const ViewPayment = () => {
    const [payments, setPayments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch("http://localhost:2606/api/verify", {
                    credentials: "include",
                });
                const json = await response.json();
                setPayments(Array.isArray(json.payments) ? json.payments : []);
            } catch (error) {
                alert("An error occurred. Please try again later.");
                console.error(error);
            }
        };

        fetchPayments();
    }, []);

    // Filter payments based on search query (User Name or Order ID)
    const filteredPayments = payments.filter((item) => {
        const fullName = `${item.order_id?.User_id?.First_name || ""} ${item.order_id?.User_id?.Last_name || ""}`.toLowerCase();
        const orderId = item.order_id?._id?.toLowerCase() || "";
        return (
            fullName.includes(searchQuery.toLowerCase()) ||
            orderId.includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className="payments-container">
            <h2>Payment Details</h2>
            <input
                type="text"
                placeholder="Search by User Name & Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="paymentsearch-input"
            />

            <div className="table-wrapper">
                <table className="payments-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Amount</th>
                            <th>Payment ID</th>
                            <th>Order ID</th>
                            <th>Payment Status</th>
                            <th>Debit/Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((item, index) => (
                                <tr key={item._id || index}>
                                    {console.log("pppppp",item)}
                                    <td>
                                        {item.order_id?.User_id?.First_name || "N/A"} {" "}
                                        {item.order_id?.User_id?.Last_name || ""}
                                    </td>
                                    <td>{item.total_payment}</td>
                                    <td>{item.payment_id ? item.payment_id : item._id}</td>
                                    <td>{item.order_id?._id}</td>
                                    <td>{item.payment_status}</td>
                                    <td>{item.transaction_Type}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No matching payments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};