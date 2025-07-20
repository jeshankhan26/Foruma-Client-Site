// PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../Provider/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Optional: a spinner or loading UI
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;