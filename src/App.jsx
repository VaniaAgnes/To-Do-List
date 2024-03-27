import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase"; // Correct the import path
import ToDoList from "./ToDoList.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile.jsx";

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return null; // Or a loading spinner or message
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todolist" element={<ToDoList />} />
        <Route path="/profile" element={<Profile />} />
        {/* Redirect logic */}
        <Route path="/register-successful" element={<Navigate to="/login" />} />
        <Route path="/google-login-successful" element={<Navigate to="/todolist" />} />
        {/* Protected routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/todolist" /> : <Login />}
        />
        <Route
          path="/todolist"
          element={user ? <ToDoList /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
