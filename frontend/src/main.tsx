import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./auth/login";
import SignUp from "./auth/signup";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import ProfilePage from "./student/ProfilePage";
import EditProfilePage from "./student/EditProfilePage";
import StudentLandingPage from "./student/StudentLandingPage";
import MyProjectsPage from "./projects/MyProjectsPage";
import ProjectFormPage from "./projects/ProjectFormPage";
import BrowsePage from "./recruiter/BrowsePage";
import ProjectDetailPage from "./recruiter/ProjectDetailPage";
import RecruiterProfilePage from "./recruiter/RecruiterProfilePage";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Student-only routes */}
        <Route element={<ProtectedRoute allowedRole="Student" />}>
        <Route path="/students" element={<StudentLandingPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/projects/me" element={<MyProjectsPage />} />
          <Route path="/projects/me/new" element={<ProjectFormPage />} />
          <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
          
        </Route>

        {/* Recruiter-only routes */}
        <Route element={<ProtectedRoute allowedRole="Recruiter" />}>
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/browse/:id" element={<ProjectDetailPage />} />
          <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
