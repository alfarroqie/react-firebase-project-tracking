import React from "react"
import { Routes, Route } from "react-router-dom"

import { AuthProvider } from "./authConfig/AuthContext"
import Login from "./pages/Login"
import AppPMO from "./pages/pmo/AppPMO"
import AppPM from "./pages/pm/AppPM"

function App() {
  return (
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          {/* <Route path="/logout" element={<Logout/>} /> */}
          <Route path="/pmo/*" element={<AppPMO/>} />
          <Route path="/pm/*" element={<AppPM/>} />
        </Routes>
      </AuthProvider>
  )
}

export default App