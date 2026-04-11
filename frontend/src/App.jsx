import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Public pages
import Home from './pages/public/Home.jsx';
import Projects from './pages/public/Projects.jsx';
import ProjectCaseStudy from './pages/public/ProjectCaseStudy.jsx';
import About from './pages/public/About.jsx';
import Contact from './pages/public/Contact.jsx';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageProjects from './pages/admin/ManageProjects.jsx';
import ManageSkills from './pages/admin/ManageSkills.jsx';
import ManageAbout from './pages/admin/ManageAbout.jsx';
import ManageContact from './pages/admin/ManageContact.jsx';
import ManageResume from './pages/admin/ManageResume.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import Experience from './pages/admin/Experience.jsx';
import ResumeGenerator from './pages/admin/ResumeGenerator.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin - login is public */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin - protected */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="about" element={<ManageAbout />} />
            <Route path="contact" element={<ManageContact />} />
            <Route path="resume" element={<ManageResume />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="experience" element={<Experience />} />
            <Route path="resume-generator" element={<ResumeGenerator />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
