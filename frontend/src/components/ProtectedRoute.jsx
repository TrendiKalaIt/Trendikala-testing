// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectCurrentUser } from '../utility/auth/authSlice';

const ProtectedRoute = () => {
  const currentUser = useSelector(selectCurrentUser);
  return currentUser ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
