import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import api from '../api/api'
import { useNavigate, Link } from'react-router-dom'

const Sales = () => {
    const [user, setUser] = useState()
    const [admin, setAdmin] = useState()
    const [sales, setSales] = useState([])
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userfetch = await api.get('/user/me')
                setUser(userfetch.data)
                setAdmin(userfetch.data.admin)
                
            } catch (err){
                console.error(err)
                navigate("/login")
            }
        }
        fetchUser()
    }, [navigate])

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await api.get('leadsSales')
                setSales(res.data)
                setError("")
            } catch {
                setError("Não foi possivel carregar as vendas!")
            }
        }
        fetchSales()
    }, [])
  return (
    <>
        <NavBar userData={user} admin={admin}/>
        <div className='container'>
        <h1>Vendas</h1>
        <p>Vendas realizadas via Exact-Sales</p>
        {error && (
        <div class="alert alert-danger" role="alert">
          {error}
        </div>
        )}
        <table className="table">
          <thead>
              <tr>
                  <th scope="col">#</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Data de Venda</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Vendedor</th>
                  <th scope="col">Preenchido</th>
                  <th scope="col">Ativo</th>
                  <th>Ações</th>
              </tr>
          </thead>
          <tbody>
            {
              sales.map((lead) => {
                return <tr key={lead.id}>
                  <th scope="row">{lead.id}</th>
                  <td>{lead.company}</td>
                  <td>{lead.sale_date}</td>
                  <td>R$ {lead.value}</td>
                  <td>{lead.seller_name}</td>
                  <td>{!lead.filled ? <i className="bi bi-x-circle"></i> : lead.filled}</td>
                  <td>{lead.active ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}</td>
                  <td><Link to={"/checklist/0/" + lead.id}><i className="bi bi-card-checklist m-1"></i></Link>
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

export default Sales