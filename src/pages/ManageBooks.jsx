import { useState, useEffect, startTransition } from "react";
import "../pages-css/ManageBooks.css";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Context/AlertContext";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

export const ManageBooks = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const [bookdata, setBookdata] = useState([]);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const fetchBook = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Book`);
      const data = await res.json();
      setBookdata(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const redirectBook = () => {
    navigate("/Admin/ManageBooks/AddBook");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/Book`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: id }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("Book deleted successfully","success");
        setBookdata(bookdata.filter((book) => book._id !== id));
      } else {
        showAlert(result.error || "Failed to delete the book.","error");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      showAlert("An error occurred while deleting the book.","error");
    }
  };

  const handleEdit = async (product) => {
    navigate("/Admin/ManageBooks/EditBooks", { state: { product } });
  };

  const handleAddProduct = () => {
    const name = prompt("Enter product name:");
    const price = prompt("Enter product price:");
    const category = prompt("Enter product category:");
    if (name && price && category) {
      const newProduct = { id: products.length + 1, name, price, category };
      setProducts([...products, newProduct]);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <h1 className="title">Products Management</h1>
      <div className="books-card">
        <div className="card-content">
          <div className="header">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input centered"
            />
            <button className="add-product centered" onClick={redirectBook}>
              Add Books
            </button>
          </div>
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>ISBN</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(bookdata) && bookdata.length > 0 ? (
                bookdata.map((product, index) => (
                  <tr key={product._id} className="product-row">
                    <td className="centered">{index + 1}</td>
                    <td>
                      <img
                        src={`${BASE_URL}/${product.BookImageURL}`}
                        alt={product.BookName}
                        className="bookImage"
                      />
                    </td>
                    <td className="centered">
                      {product.BookName.length > 15
                        ? product.BookName.slice(0, 15) + "..."
                        : product.BookName}
                    </td>
                    <td className="centered">{product.Price}</td>
                    <td className="centered">{product.ISBN}</td>
                    <td className="centered">{product.Author}</td>
                    <td className="centered">
                      <div className="actions centered">
                        <button
                          className="edit-btn centered"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn centered"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="centered">No books available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
