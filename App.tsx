import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ActivityPage } from './pages/ActivityPage';
import { ResultPage } from './pages/ResultPage';
import { RedirectHandler } from './components/RedirectHandler';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <Layout>
              <ActivityPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <Layout>
              <ResultPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/:code" element={<RedirectHandler />} />
    </Routes>
  );
}

function App() {
  // Force redirect to nano.link to ensure consistent localStorage access
  React.useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const port = window.location.port ? `:${window.location.port}` : '';
      const newUrl = `http://nano.link${port}${window.location.pathname}${window.location.search}`;
      window.location.href = newUrl;
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
