
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import SlackClone from "./components/SlackClone/SlackClone";
import "./styles/global.css";

// Function to check if user is logged in
const isAuthenticated = () => {
  return localStorage.getItem('pulseVerseUser') !== null;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Public route - redirects to app if user is already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/app" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected routes */}
      <Route path="/app" element={<ProtectedRoute><SlackClone /></ProtectedRoute>} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
