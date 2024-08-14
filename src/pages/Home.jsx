import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import NavBar from '../components/NavBar'

const Home = () => {
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userFetch = await api.get('/user/me')
          setUser(userFetch.data)
          setAdmin(userFetch.data.admin)

        } catch (err) {
          console.error(err)
          navigate("/login")
        }
      }
      fetchUser()
    }, [navigate])


  return (
    <>
      <NavBar userData={user} admin={admin} />
      <div className='m-5'>
        <h1>Nada aqui por enquanto...</h1>
      </div>
    </>

  )
}

export default Home
