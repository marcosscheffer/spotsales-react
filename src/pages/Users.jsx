import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import NavBar from '../components/NavBar'

const Users = () => {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(false)
  const [users, setUsers] = useState([])
  const [update, setUpdate] = useState(null)
  const [error, setError] = useState()
  const navigate = useNavigate()
  
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user/me')
        setUser(res.data)
        setAdmin(res.data.admin)
      } catch (err) {
        navigate("/login")
      }
    }
    fetchUser()
  }, [navigate])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('user')
        if (res.status === 200) {
          setUsers(res.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [update])

  const handleApprove = async (userData) => {
    try {
      const data = userData
      if (data.id !== user.id) {
        data.active = !data.active
        const res = await api.put(`user/${data.id}`, data)
        setUpdate(res.data)
      } else {
        setError("Você não pode mudar isso em seu proprio usuario!")
      }
    } catch (err) {
      setError("Não foi possivel (des)aprovar este usuario!")
    }
  }

  const handleBot = async (userData) => {
    try {
      const data = userData
      if (data.id !== user.id){
        data.bot =!data.bot
        const res = await api.put(`user/${data.id}`, data)
        setUpdate(res.data)
      } else {
        setError("Você não pode mudar isso em seu proprio usuario!")
      }
    } catch(err) {
      setError("Não foi possivel mudar valor de bot deste usuario!")
    }
  }

  const handleAdmin = async (userData) => {
    try {
      const data = userData
      if (data.id !== user.id) {
        data.admin =!data.admin
        const res = await api.put(`user/${data.id}`, data)
        setUpdate(res.data)
      } else {
        setError("Você não pode mudar isso em seu proprio usuario!")
      }
    } catch(err) {
      setError("Não foi possivel adicionar ou remover o admin deste usuario!")
    }
  }



  return ( 
    <>
      <NavBar userData={user} admin={admin }/>
      <div className='container'>
        <h1>Usuarios</h1>
        <p>Configurações de usuarios</p>
        {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>)}
        
        <table className="table">
          <thead>
              <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Cargo</th>
                  <th scope="col">Admin</th>
                  <th scope="col">Bot</th>
                  <th scope="col">Ativo</th>
                  <th>Ações</th>
              </tr>
          </thead>
          <tbody>
            {
              users.map((userData) => {
                return <tr key={userData.id}>
                  <th scope="row">{userData.id}</th>
                  <td>{userData.name}</td>
                  <td>{userData.position_id}</td>
                  <td>{userData.admin === true ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}</td>
                  <td>{userData.bot === true ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}</td>
                  <td>{userData.active === true ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}</td>
                  <td>{!userData.active ? <Link onClick={async () => await handleApprove(userData)}><i className="bi bi-check-circle m-1"></i></Link> :
                                          <Link onClick={async () => await handleApprove(userData)}><i className="bi bi-x-circle m-1"></i></Link>}
                      <Link><i className="bi bi-robot m-1" onClick={async () => await handleBot(userData)}></i></Link>
                      <Link><i className="bi bi-award m-1" onClick={async () => await handleAdmin(userData)}></i></Link>
                      <Link><i className="bi bi-pencil m-1"></i></Link>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>

      </div>
    </>
  
  )
}

export default Users
