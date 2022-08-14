import { Outlet } from "react-router-dom";
import { useLocation, Navigate } from "react-router-dom";
import Nav from "../components/Nav";
import getCookies from "../utils/getCookies";

const Layout = () => {
  const state = getCookies();
  const location = useLocation();
  if (location.pathname === "/" && !state.logged) {
    return <Navigate to="/login" />;
  }
  if (location.pathname === "/" && state.logged) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <main className="App">
      <>
        <Nav />
        <Outlet />
      </>
    </main>
  );
};

export default Layout;
