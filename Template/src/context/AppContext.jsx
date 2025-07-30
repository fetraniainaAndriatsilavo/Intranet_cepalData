import { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
//   const [token, setToken] = useState(localStorage.getItem("token"));

  let initialUser = null;
  try {
    initialUser = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error("Invalid user JSON:", e);
  } 

  const [user, setUser] = useState(initialUser);

  return (
    <AppContext.Provider value={{user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
