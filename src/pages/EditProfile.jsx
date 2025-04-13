import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages-css/EditProfile.css"; 
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

export const EditProfile = () => {
  const location = useLocation();
  const userData = location.state?.user; 
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    name: userData ? `${userData.First_name} ${userData.Last_name}` : "",
    email: userData ? userData.Email : "",
    mobile: userData ? userData.Phone_no || "" : "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData?._id) {
      showAlert("User ID is missing. Cannot update.","error");
      return;
    }

    const [firstName, lastName] = formData.name.split(" "); 

    try {
      const response = await fetch(`${BASE_URL}/api/User`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: userData._id, 
          firstname: firstName || "", 
          lastname: lastName || "",
          email: formData.email,
          mobile: formData.mobile,
        }),
      });


      const result = await response.json();

      if (response.ok) {
        showAlert("Profile updated successfully!","success");
        navigate("/Profile");
      } else {
        showAlert(result.error || "Failed to update user.","error");
      }
    } catch (error) {
      console.error("Error in try block:", error);
      showAlert("An error occurred.","error");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Mobile_no :
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};
