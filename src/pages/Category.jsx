import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pages-css/Category.css";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

export const Category = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/Category`);
                const data = await response.json();
                setCategories(data);
                fetchAllSubcategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const fetchAllSubcategories = async (categories) => {
        const subcategoryData = {};
        await Promise.all(
            categories.map(async (category) => {
                try {
                    const response = await fetch(`${BASE_URL}/api/${category._id}/Subcategory`);
                    const data = await response.json();
                    subcategoryData[category._id] = data;
                } catch (error) {
                    console.error(`Error fetching subcategories for ${category._id}:`, error);
                    subcategoryData[category._id] = [];
                }
            })
        );
        setSubcategories(subcategoryData);
    };

    return (
        <div className="category-container">
            <h2 className="category-header">Books Categories</h2>
            <div className="categories">
                {categories.map((category) => (
                    <div key={category._id} className="category">
                        <h3>{category.Category_Name}</h3>
                        {subcategories[category._id] && (
                            <ul>
                                {subcategories[category._id].map((subcategory) => (
                                    <li key={subcategory._id}>
                                        <Link to={`/books/${category.Category_Name}/${subcategory.Subcategory_Name}`}>
                                            {subcategory.Subcategory_Name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};