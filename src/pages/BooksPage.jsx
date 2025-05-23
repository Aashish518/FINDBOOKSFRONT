
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../components-css/Bookcard.css";
import Load from "../components/Load";
import { Bookcard } from "../components/Bookcard";
import { FilterComponent } from "../components/Filter";
import { Linkurl } from "../components/Linkurl";
const backlink = Linkurl();
import Cookies from 'js-cookie';
const token = Cookies.get("token");

export const BooksPage = () => {
  const { subcategory } = useParams();
  const [book, setBook] = useState([]);
  const [originalBooks, setOriginalBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [bookRes, sellOrderRes] = await Promise.all([
          fetch(`${backlink}/api/${subcategory}/Books`, {
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
          setBook([]);
          setOriginalBooks([]);
          setLoading(false);
          return;
        }
  
        setBook(bookData);
        setOriginalBooks(bookData);

        // Hide books only if Resell_Status is "Sell", "Collected"
        const hiddenBookIds = new Set(
          sellOrderData.resellers
            .filter(reseller => ["Sell", "Collected"].includes(reseller.Resell_Status))
            .map(reseller => reseller.Book_id)
        );
  
        setBook(bookData.filter(book => !hiddenBookIds.has(book._id)));
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [subcategory]);
  

  if (loading) {
    return (
      <div>
        <h1>
          <Load />
        </h1>
      </div>
    );
  }

  return (
    <>
      <FilterComponent books={originalBooks} onFilterChange={(filteredBooks) => setBook(filteredBooks)} />


      <div className="bookpage-div" style={{marginLeft:"20%", marginTop:"0"}}>
        <section className="card-container">
          <div className="booktype">
            {subcategory}
          </div>
          <div>
            <ul className="cards">
              {book.length <= 0 ? (
                <div className="nobooks">
                  <h4>No Books In the Stock</h4>
                </div>
              ) : (
                book.map((book) => <Bookcard key={book._id} book={book} />)
              )}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
};