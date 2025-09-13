import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AuthPage from './Pages/AuthPage'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import Profile from './Pages/Profile'
import MyRatings from './Pages/MyRatings'
import ProtectedRoute from './components/ProtectedRoute'
import StoreRatingsPage from './Pages/StoreRatingsPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-ratings" 
            element={
              <ProtectedRoute>
                <MyRatings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/store-ratings" 
            element={
              <ProtectedRoute>
                <StoreRatingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
