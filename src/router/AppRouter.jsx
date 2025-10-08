import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Onboard from "../pages/Onboard";
import ProtectedRoute from "../component/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes (no MainLayout wrapper) */}
        <Route
          path="/onboard"
          element={
            <ProtectedRoute>
              <Onboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
