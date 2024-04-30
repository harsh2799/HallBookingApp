import { useState, useEffect, createContext, useContext } from 'react'
import './App.css'
import axios from 'axios'
import Home from './Home'
import Login from './Login'

function App() {
  const loggedUser = createContext()
  const [user, setUser] = useState("")
  const UserContext = createContext()

  const updateUser = (username) => {
    setUser(username);
  }

  return (
    <UserContext.Provider value={user}>
      {!user ? <Login updateUser={updateUser} /> : <Home /> }
    </UserContext.Provider>
  )
}

export default App
