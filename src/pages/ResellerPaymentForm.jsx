import React, { useState } from "react";
import "../pages-css/ResellerPaymentForm.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

export const ResellerPaymentForm = () => {
    const [paymentMethod, setPaymentMethod] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { bookData, UserRole } = location.state || {};
    const { showAlert } = useAlert();

    const [formData, setFormData] = useState({
        address: "",
        upi_id: "",
        bank_acc_no: "",
        ifsc_code: "",
        Pincode: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (formData.address.trim().length < 10) {
            newErrors.address = "Address must be at least 10 characters.";
        }
        if (!/^[0-9]{6}$/.test(formData.Pincode)) {
            newErrors.Pincode = "Pincode must be exactly 6 digits.";
        }
        if (!paymentMethod) {
            showAlert("Please select a payment method.", "error");
            return false;
        }
        if (paymentMethod === "UPI" && !/^[\w.-]+@[a-zA-Z]+$/.test(formData.upi_id)) {
            newErrors.upi_id = "Invalid UPI ID format.";
        }
        if (paymentMethod === "Banking Details") {
            if (!/^[0-9]{9,18}$/.test(formData.bank_acc_no)) {
                newErrors.bank_acc_no = "Bank account number must be 9 to 18 digits.";
            }
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)) {
                newErrors.ifsc_code = "Invalid IFSC code format.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSend = new FormData();
        for (const key in bookData) {
            formDataToSend.append(key, bookData[key]);
        }

        try {
            const response = await fetch(`${BASE_URL}/api/${UserRole}/Book`, {
                method: "POST",
                body: formDataToSend,
                credentials: "include",
            });

            const json = await response.json();
            const bookid = json.book?._id;
            if (bookid) {
                try {
                    const response = await fetch(`${BASE_URL}/api/ResellerPaymentForm`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...formData, bookid }),
                        credentials: "include",
                    });
                    const json = await response.json();
                    if (json.data) {
                        showAlert("Data added successfully", "success");
                        navigate("/SellOrders");
                    } else {
                        showAlert("Failed to save payment details", "error");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    showAlert("Something went wrong. Please try again.", "error");
                }
            } else {
                showAlert(json.message || "Book not added", "error");
            }
        } catch (error) {
            console.error("Error occurred during submission:", error);
            showAlert("An error occurred while adding the book.", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-details-form">
            <h2>Payment Details Form</h2>

            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange}/>
            {errors.address && <span className="error-message">{errors.address}</span>}

            <label>Pincode</label>
            <input type="text" name="Pincode" value={formData.Pincode} onChange={handleChange}/>
            {errors.Pincode && <span className="error-message">{errors.Pincode}</span>}

            <label>Payment Recieve Method</label>
            <select className="payment-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="Banking Details">Banking Details</option>
            </select>

            {paymentMethod === "UPI" && (
                <>
                    <label>UPI ID</label>
                    <input type="text" name="upi_id" value={formData.upi_id} onChange={handleChange}/>
                    {errors.upi_id && <span className="error-message">{errors.upi_id}</span>}
                </>
            )}

            {paymentMethod === "Banking Details" && (
                <>
                    <label>Bank Account Number</label>
                    <input type="text" name="bank_acc_no" value={formData.bank_acc_no} onChange={handleChange}/>
                    {errors.bank_acc_no && <span className="error-message">{errors.bank_acc_no}</span>}

                    <label>IFSC Code</label>
                    <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange}/>
                    {errors.ifsc_code && <span className="error-message">{errors.ifsc_code}</span>}
                </>
            )}

            <button type="submit" className="resellsubmit-btn">Submit</button>
        </form>
    );
};