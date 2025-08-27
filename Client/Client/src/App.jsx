import { useState } from 'react'
import './App.css'
import AuthForm from './Auth/AuthForm'
import { Toaster } from './components/ui/sonner'
import LandingPage from './HomeSection/LandingPage'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './Auth/ProtectedRoute'
import Dashboard from './Teacher/Dashboard'
import MyQuizzes from './Teacher/MyQuizzes'
import CreateQuize from './Teacher/CreateQuize'
import StudentRecord from './Teacher/StudentRecord'
import Analytics from './Teacher/Analytics'
import Navigation from './HomeSection/Navigation'
import Footer from './HomeSection/Footer'
import StudentDashboard from './Student/StudentDashboard'
import EditQuize from './Teacher/EditQuize'
import TakeQuize from './Student/TakeQuize'
import Result from './Student/Result'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigation />
      
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/signup" element={<AuthForm />} />


      {/* protected routes -teacher*/}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/teacher/dashboard" element={<Dashboard />} />
        <Route path="/teacher/quizzes" element={<MyQuizzes />} />
        <Route path="/teacher/createQuize" element={<CreateQuize />} />
        <Route path="/teacher/students" element={<StudentRecord />} />
        <Route path="/teacher/analytics" element={<Analytics />} />
        <Route path="/teacher/editQuize/:id" element={<EditQuize/>} />
      </Route>

      {/* protected routes -student*/}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student/:id/dashboard" element={<StudentDashboard/>} />
        <Route path="/student/:id/take-quiz" element={<TakeQuize/>} />
        <Route path="/student/:id/view-results" element={<Result/>} />
      </Route>

      
      
      
      
      
      </Routes>

      <Footer/>


      
      <Toaster position="bottom-right" richColors/>
    </>
  )
}

export default App
