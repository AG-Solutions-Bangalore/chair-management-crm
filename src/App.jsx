import { useNavigate } from "react-router-dom";

import SessionTimeoutTracker from "./components/session-timeout-tracker/session-timeout-tracker";

import Cookies from "js-cookie";
import { Toaster } from "sonner";
import ScrollToTop from "./components/common/scroll-to-top";
import AppRoutes from "./routes/app-routes";
import { appLogout } from "./utils/logout";

function App() {
  const navigate = useNavigate();
  const time = Cookies.get("token-expire-time");
  const handleLogout = () => {
    appLogout();
    navigate("/");
  };
  return (
    <>
      {/* <DisabledRightClick /> */}
      <Toaster richColors position="top-right" />
      <ScrollToTop />
      <SessionTimeoutTracker expiryTime={time} onLogout={handleLogout} />
      <AppRoutes />
    </>
  );
}

export default App;
