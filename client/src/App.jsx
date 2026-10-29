import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { getToken, getUser } from './lib/api'

const ProtectedRoute = ({ children }) => getToken() && getUser() ? children : <Navigate to="/login?state=login" replace />

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='app' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>

        <Route path='view/:resumeId' element={<ProtectedRoute><Preview /></ProtectedRoute>} />
        <Route path='login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App