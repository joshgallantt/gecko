import { Routes, Route } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Project from "./pages/Project";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />

        <Route element={<RequireAuth adminOnly={true} />}>
          <Route
            path="admin"
            element={<div>Disabled for the demo to prevent tampering</div>}
          />
        </Route>

        <Route element={<RequireAuth adminOnly={false} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/project/:id/ticket/:ticket" element={<Project />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
