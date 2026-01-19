import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './styles/global.css'

// Onboarding pages
import Login from './pages/onboarding/Login'
import Register from './pages/onboarding/Register'
import Welcome from './pages/onboarding/Welcome'
import Personalize from './pages/onboarding/Personalize'

// Main app pages
import Stack from './pages/Stack'
import Leaders from './pages/Leaders'
import Media from './pages/Media'
import Learn from './pages/Learn'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/sud/claude/civiq/app">
        <div className="app-container">
          <Routes>
            {/* Onboarding flow */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/personalize" element={<Personalize />} />

            {/* Main app */}
            <Route path="/stack" element={<Stack />} />
            <Route path="/leaders" element={<Leaders />} />
            <Route path="/media" element={<Media />} />
            <Route path="/learn" element={<Learn />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
