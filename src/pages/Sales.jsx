import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import api from '../api/api'
import { useNavigate, Link } from'react-router-dom'

const Sales = () => {
    const [user, setUser] = useState()
    const [admin, setAdmin] = useState()
    const [sales, setSales] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userfetch = await api.get('/user/me')
                if (userfetch.status === 200) {
                    setUser(userfetch.data)
                    setAdmin(userfetch.data.admin)
                }
            } catch (err){
                console.error(err)
                navigate("/login")
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await api.get('leadsSales')
                setSales(res.data)
                console.log(res)
            } catch {
                console.error('Error fetching sales')
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
        <table className="table">
          <thead>
              <tr>
                  <th scope="col">#</th>
                  <th scope="col">Data de Venda</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Vendedor</th>
                  <th scope="col">Ativo</th>
                  <th>Ações</th>
              </tr>
          </thead>
          <tbody>
            {
              sales.map((lead) => {
                return <tr key={lead.id}>
                  <th scope="row">{lead.id}</th>
                  <td>{lead.sale_date}</td>
                  <td>R$ {lead.value}</td>
                  <td>{lead.seller_id ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}</td>
                  <td>{lead.active ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}</td>
                  <td><Link><i className="bi bi-check-circle m-1"></i></Link>
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

export default Sales