import { useLocation, Navigate, Outlet } from "react-router-dom";
import getCookies from "../utils/getCookies";

const RequireAuth = ({ adminOnly }) => {
  const location = useLocation();
  const cookies = getCookies();

  if (cookies.logged && cookies.admin && adminOnly) {
    return <Outlet />;
  } else if (cookies.logged && !adminOnly) {
    return <Outlet />;
  } else if (cookies.logged) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
