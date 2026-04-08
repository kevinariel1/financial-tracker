import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    //Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
    }

    //Function to clear user data (ex. Logout)
    const clearUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        updateUser(null);
    }

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;