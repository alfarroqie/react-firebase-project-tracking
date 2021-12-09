import React, { useContext, useState, useEffect } from "react"
import { auth, database } from "./firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  // const [currentUserData, setCurrentUserData] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password, name, role) {
    return auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      var pmoRole = false
      if (role === "pmo"){
        pmoRole = true
      }
      database.users.doc(auth.currentUser.uid).set({
        name: name,
        email: email,
        isPmo: pmoRole
      }).then(()=> {
        auth.signOut()
      })
    })
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  useEffect(() => {
    let isSubscribed = true
    if (isSubscribed) {
      setLoading(true)
      auth.onAuthStateChanged((user) => {
        if(user){
          database.users.doc(user.uid).get().then(doc => {
            setCurrentUser({userAuth: user, userData:{id:doc.id, ...doc.data()}})
          })
        } else{
          setCurrentUser(user)
        }
        setLoading(false)
      })
    }
    return () => isSubscribed = false
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}