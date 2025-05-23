import { useState, useEffect} from "react";
import "../pages-css/ManageBooks.css";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Context/AlertContext";
import { Linkurl } from "../components/Linkurl";
const backlink = Linkurl();
import Cookies from 'js-cookie';
const token = Cookies.get("token");

export const ManageBooks = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const [bookdata, setBookdata] = useState([]);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const fetchBook = async () => {
    try {
      const [bookRes, sellOrderRes] = await Promise.all([
        fetch(`${backlink}/api/Book`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
}),
        fetch(`${backlink}/api/resellerbook`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
})
      ]);

      const [bookData, sellOrderData] = await Promise.all([
        bookRes.json(),
        sellOrderRes.json()
      ]);

      if (!Array.isArray(bookData) || !sellOrderData?.resellers) {
        console.warn("Expected an array but got:", bookData, sellOrderData);
        setBookdata([]);
        return;
      }

      const hiddenBookIds = new Set(
        sellOrderData.resellers
          .filter(reseller =>
            ["Sell", "Collected", "Delivered"].includes(reseller.Resell_Status)
          )
          .map(reseller => reseller.Book_id)
      );

      setBookdata(bookData.filter(book => !hiddenBookIds.has(book._id)));
    } catch (error) {
      console.error("Fetch Error:", error);
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
      const response = await fetch(`${backlink}/api/Book`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
              // value={search}
              // onChange={handleSearch}
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
                        src={`${backlink}/${product.BookImageURL}`}
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
