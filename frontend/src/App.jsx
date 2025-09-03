// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import TimeCapsule from './components/TimeCapsule';
import CommunityFeed from './components/CommunityFeed';
import PersonalityTest from './components/PersonalityTest';
import PersonalityResult from './components/PersonalityResult';
import AITherapy from './components/AITherapy';
import BookSession from './components/BookSession';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './components/Settings';
import PrivateTimeCapsules from './components/PrivateTimeCapsules';
import Profile from './components/Profile';
import Upgrade from './components/Upgrade';
import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.css'
import axios from 'axios';
import { AccessProvider } from './contexts/AccessContext';

axios.defaults.withCredentials = true;

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AccessProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background dark:bg-black relative">
            <Header />
            <div className="container mx-auto px-4 py-8 text-text-light-primary dark:text-text-dark-primary">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/time-capsule"
                  element={
                    <ProtectedRoute>
                      <TimeCapsule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <CommunityFeed />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/personality-test"
                  element={
                    <ProtectedRoute>
                      <PersonalityTest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/personality-result"
                  element={
                    <ProtectedRoute>
                      <PersonalityResult />
                    </ProtectedRoute>
                  }
                />
                <Route path="/my-timecapsules" 
                element={
                <ProtectedRoute>
                <PrivateTimeCapsules />
                </ProtectedRoute>
                } 
                />
                <Route
                  path="/ai-therapy"
                  element={
                    <ProtectedRoute>
                      <AITherapy />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/book-session"
                  element={
                    <ProtectedRoute>
                      <BookSession />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
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
                path="/upgrade"
                element={
                  <ProtectedRoute>
                    <Upgrade />
                  </ProtectedRoute>
                }
              />
            </Routes>
            </div>
          </div>
        </ThemeProvider>
        </AccessProvider>
      </AuthProvider>
    </Provider>
  );
}
console.log("API URL:", import.meta.env.NEXT_PUBLIC_API_URL);

export default App;