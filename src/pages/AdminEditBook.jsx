import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../components-css/BookForm.css";
import { useAlert } from "../Context/AlertContext";
import { Linkurl } from "../components/Linkurl";
const backlink = Linkurl();
import Cookies from 'js-cookie';
const token = Cookies.get("token");

export const AdminEditBook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  const {showAlert} = useAlert();
  

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    BookName: "",
    image: null,
    Author: "",
    Edition: "",
    Publication_Date: "",
    Publisher: "",
    Description: "",
    Price: "",
    ISBN: "",
    isold: "",
    Category: "",
    SubCategory: "",
  });

  const editbook = async () => {
    try {
      if (!product?._id) {
        showAlert("Book ID is required for updating the book.","error");
        return;
      }
  
      let body;
      let headers = {};
  
      if (formData.image && typeof formData.image === "object") {
        // If an image is selected, use FormData
        body = new FormData();
        Object.entries({ ...formData, bookId: product._id }).forEach(([key, value]) =>
          body.append(key, value)
        );
      } else {
        // Otherwise, send JSON
        body = JSON.stringify({ ...formData, bookId: product._id });
        headers["Content-Type"] = "application/json";
      }
  
      const response = await fetch(`${backlink}/api/Book`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body,
        credentials: "include",
      });
  
      const result = await response.json();
  
      if (response.ok) {
        showAlert("Book updated successfully","success");
        navigate("/Admin");
      } else {
        showAlert(result.error || "Failed to update the book.","error");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      showAlert("An error occurred while updating the book.","error");
    }
  };
  
  

  useEffect(() => {
    if (product) {
      setFormData({
        BookName: product.BookName || "",
        image: product.image || null,
        Author: product.Author || "",
        Edition: product.Edition || "",
        Publication_Date: product.Publication_Date || "",
        Publisher: product.Publisher || "",
        Description: product.Description || "",
        Price: product.Price || "",
        ISBN: product.ISBN || "",
        isold: product.isold || "",
        Category: product.Category || "",
        SubCategory: product.SubCategory || "",
      });
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backlink}/api/Category`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.Category) {
      const fetchSubcategories = async () => {
        try {
          const response = await fetch(
            `${backlink}/api/${formData.Category}/Subcategory`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
          }
          );
          const data = await response.json();
          setSubcategories(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setSubcategories([]);
        }
      };
      fetchSubcategories();
    }
  }, [formData.Category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editbook(); // Call the update function
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      Category: e.target.value,
      SubCategory: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  return (
    <form onSubmit={handleSubmit} className="resellerbookform">
      <label>Book Name</label>
      <input
        type="text"
        name="BookName"
        value={formData.BookName}
        onChange={handleChange}
      />

      <label>Book Image</label>
      <input
        type="file"
        name="image"
        onChange={handleImageChange}
        accept="image/*"
      />
      {product?.image && !formData.image && (
        <img
          src={`${backlink}/${product.image}`}
          alt="Current Preview"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
      )}
      {formData.image && typeof formData.image === "object" && (
        <img
          src={URL.createObjectURL(formData.image)}
          alt="New Preview"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
      )}

      <label>Author</label>
      <input
        type="text"
        name="Author"
        value={formData.Author}
        onChange={handleChange}
      />

      <label>Publication Date</label>
      <input
        type="date"
        name="Publication_Date"
        value={formData.Publication_Date}
        onChange={handleChange}
      />

      <label>Price</label>
      <input
        type="number"
        name="Price"
        value={formData.Price}
        onChange={handleChange}
      />

      <label>ISBN No</label>
      <input
        type="text"
        name="ISBN"
        value={formData.ISBN}
        onChange={handleChange}
      />

      <label>Category</label>
      <select
        name="Category"
        value={formData.Category}
        onChange={handleCategoryChange}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.Category_Name}
          </option>
        ))}
      </select>

      <label>Subcategory</label>
      <select
        name="SubCategory"
        value={formData.SubCategory}
        onChange={handleChange}
      >
        <option value="">Select Subcategory</option>
        {subcategories.map((subcategory) => (
          <option key={subcategory._id} value={subcategory._id}>
            {subcategory.Subcategory_Name}
          </option>
        ))}
      </select>

      <button type="submit" className="resellerbook-btn">
        Update Book
      </button>
    </form>
  );
};


