import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import api from '../api/api'
import NavBar from '../components/NavBar'

const Users = () => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [update, setUpdate] = useState(null)
  const navigate = useNavigate()
  
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user/me')
        setUser(res.data)
      } catch (err) {
        navigate("/login")
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('user')
        if (res.status === 200) {
          setUsers(res.data)
          console.log(res)

          
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [])

  const handleApprove = async (user) => {
    try {
      const data = user
      data.active = !user.active
      const res = await api.put(`user/${user.id}`, data)
      setUpdate(res.data)
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }



  return ( 
    <>
      <NavBar userData={user}/>
      <div className='container'>
        <h1>Usuarios</h1>
        <p>Configurações de usuarios</p>
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
                      <Link><i className="bi bi-robot m-1"></i></Link>
                      <Link><i className="bi bi-award m-1"></i></Link>
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
