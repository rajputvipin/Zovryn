import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Users from './pages/Users';
import Layout from './layouts/Layout';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route
            path="dashboard"
            element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><Dashboard /></ProtectedRoute>}
          />

          <Route path="records" element={<Records />} />

          <Route
            path="users"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute>}
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
