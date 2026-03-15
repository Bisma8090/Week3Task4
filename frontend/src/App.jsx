import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Projects from "./pages/Projects";
import Members from "./pages/Members";
import Dashboard from "./pages/Dashboard";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute><Projects /></ProtectedRoute>
      } />
      <Route path="/members" element={
        <ProtectedRoute><Members /></ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;