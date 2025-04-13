import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages-css/AdminAddUser.css";
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

export const AdminEditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { User } = location.state || {}; 
    const {showAlert} = useAlert();

  const [user, setUser] = useState({
    id : "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    role: "",
  });

  useEffect(() => {
    if (User) {
      setUser({
        id : User._id,
        firstName: User.First_name || "",
        lastName: User.Last_name || "",
        email: User.Email || "",
        mobile: User.Phone_no || "", 
        role: User.Role,
      });
    }
  }, [User]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const editUser = async (e) => {
    e.preventDefault();
    
    if (!user.id) {
      showAlert("User ID is missing. Cannot update.","error");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/User`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id, 
          firstname: user.firstName,
          lastname : user.lastName,  
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        }),
      });
    
      const result = await response.json();
  
      if (response.ok) {
        showAlert("User updated successfully!","success");
        navigate("/Admin/ManageUsers");
      } else {
        showAlert(result.error || "Failed to update user.","error");
      }
    } catch (error) {
      console.error("Error in try block:", error);
      showAlert("An error occurred.","error");
    }
  };
  
  
  return (
    <div className="add-user-container">
      <h2 className="form-title">Edit User</h2>
      <form className="add-user-form" onSubmit={editUser}>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={user.firstName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={user.lastName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mobile No:</label>
          <input type="tel" name="mobile" value={user.mobile} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={user.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="DeliveryPerson">DeliveryPerson</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Update User Data
        </button>
      </form>
    </div>
  );
};
