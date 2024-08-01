import React, { useEffect } from 'react'
import { useState } from 'react'
import api from '../api/api'
import {useUser} from '../hooks/useUser'

const Home = () => {
    const [value, setValue] = useState('')

    const { user } = useUser()
 

    const handleChoose = async (event) => {
        event.preventDefault()
        try {
          await api.post('/sellers')
        } catch (err) {
          console.error(err)
        }

    }

  return (
    <div>

    </div>
  )
}

export default Home
