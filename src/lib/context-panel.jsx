import BASE_URL from "@/config/base-url";
import { appLogout } from "@/utils/logout";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isPanelUp, setIsPanelUp] = useState(true);
  const handleLogout = () => {
    appLogout();
    navigate("/");
  };
  const checkPanelStatus = async () => {
    try {
     
      const response = await fetch(`${BASE_URL}/api/panel/status`);
      const data = await response.json();
      setIsPanelUp(data);
      if (data.success === "ok") {
        if (location.pathname === "/maintenance") {
          navigate("/");
        }
      } else {
        handleLogout();

        if (!Cookies.get("token")) {
          navigate("/maintenance");
        }
      }
    } catch (error) {
      console.error("Error fetching panel status:", error);
      navigate("/maintenance");
    }
  };
  useEffect(() => {
    checkPanelStatus();

    const interval = setInterval(checkPanelStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ContextPanel.Provider value={{ isPanelUp }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
