import React, { createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);

    //Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    }

    //Function to clear user data (ex. Logout)
    const clearUser = () => {
        setUser(null);
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