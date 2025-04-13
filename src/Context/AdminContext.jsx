import { createContext, useState, useContext, useEffect } from "react";
import { BaseUrl } from "../components/BaseUrl";
const BASE_URL = BaseUrl()

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/User?t=${Date.now()}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const json = await response.json();
            setUser(json.user); 
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const refreshUser = async () => {
        setLoading(true);
        await getUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
