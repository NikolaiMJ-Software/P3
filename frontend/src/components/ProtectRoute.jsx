import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  const { username } = useParams();
  const sessionUser = sessionStorage.getItem("username");

  // If no session user, sent user to login page
  if (!sessionUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Session user exists but dosent match, change the user
  if (username && username !== sessionUser) {
    const parts = location.pathname.split("/");
    parts[parts.length - 1] = encodeURIComponent(sessionUser);
    return <Navigate to={parts.join("/")} replace />;
  }

  return <Outlet />; 
}