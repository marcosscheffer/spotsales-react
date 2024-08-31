import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'
import NavBar from '../components/NavBar'

const ChecklistFilter = () => {
  const { id } = useParams()
  const [user, setUser] = useState()
  const [admin, setAdmin] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await api.get('user/me')
            setUser(res.data)
            setAdmin(res.data.admin)

        } catch (err) {
            navigate('/login?next=/checklist/1/' + id)
        }
    }
    fetchUser()
  }, [navigate])

  useEffect(() => {
    const fetchData = async () => {
      
    }
    fetchData()
  }, [id])

  const handleSubmit = () => {
    console.log(123)
  }

  if (loading) {
    return <h1>Carregando...</h1>
  }

  return (
    <>  
        <NavBar userData={user} admin={admin} />
        <div className="container bg-secondary-subtle p-4">
            <h1>Equipamentos</h1>
            <p>Preencha de acordo com os equipamentos que serão utilizados.</p>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form className="row g-3 mt-2" onSubmit={handleSubmit}>
                
            </form>
        </div>
    </>
  )
}

export default ChecklistFilter
