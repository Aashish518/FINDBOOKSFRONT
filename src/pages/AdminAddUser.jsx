import { useState } from "react";
import "../pages-css/AdminAddUser.css"; 
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

export const AdminAddUser = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    role: "",
  });
  const Navigate = useNavigate();
  const { showAlert }  = useAlert();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/User`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("User added successfully!","success");
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          role: "",
          password: "",
        });
        Navigate("/Admin/ManageUsers");
      } else {
        showAlert(result.error || "Failed to add user.","error");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      showAlert("An error occurred while adding the user.","error");
    }
  };


  return (
    <div className="add-user-container">
      <h2 className="form-title">Add New User</h2>
      <form className="add-user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First_Name:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last_Name:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile No :</label>
          <input type="tel" name="mobile" value={user.mobile} onChange={handleChange} required />

        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={user.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Deliveryperson">Deliveryperson</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Add User
        </button>
      </form>
    </div>
  );
};
