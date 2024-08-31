import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import api from '../api/api'
import { useNavigate, Link } from'react-router-dom'

const Sales = () => {
    const [user, setUser] = useState()
    const [admin, setAdmin] = useState()
    const [sales, setSales] = useState([])
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [totalPages, setTotalPages] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userfetch = await api.get('/user/me')
                setUser(userfetch.data)
                setAdmin(userfetch.data.admin)
                
            } catch (err){
                navigate("/login")
            }
        }
        fetchUser()
    }, [navigate])

    useEffect(() => {
        const fetchSales = async () => {
            try {
              const res = await api.get('/leadsSales?page=' + page + "&q=" + search)
              setSales(res.data.results)
              setTotalPages(res.data.pages)
              setError("")
            } catch {
              setPage(1)
              setError("Não foi possivel carregar as vendas!")
            }
        }
        fetchSales()
    }, [page, search])

    function formatDateToDDMMYYYY(dateString) {
      const date = new Date(dateString)

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
    
      return `${day}/${month}/${year}`
    }

    const render_pages = () => {
      const pages = []

      pages.push(page === 1 ? <li className="page-item disabled" key="prev"><Link className="page-link" onClick={(e) => setPage(page - 1)}>Prev</Link></li> :
      <li className="page-item" key="prev"><Link className="page-link" onClick={(e) => setPage(page - 1)}>Prev</Link></li>)
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          page === i ? <li className="page-item active" key={i}><Link className="page-link" onClick={(e) => setPage(i)}>{i}</Link></li> :
          <li className="page-item" key={i}><Link className="page-link" onClick={(e) => setPage(i)}>{i}</Link></li>
        )
      }
      pages.push(page === totalPages ? <li className="page-item disabled" key="next"><Link className="page-link" onClick={(e) => setPage(page + 1)}>Next</Link></li> :
      <li className="page-item" key="next"><Link className="page-link" onClick={(e) => setPage(page + 1)}>Next</Link></li>)

      return pages
    }

  return (
    <>
        <NavBar userData={user} admin={admin}/>
        <div className='container'>
        <h1>Vendas</h1>
        <p>Vendas realizadas via Exact-Sales</p>
        <div className="container mt-5 d-flex justify-content-end input-group flex-nowrap m-3">
          <form role="search">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="addon-wrapping"
              style={{ width: '300px', height: '35px', fontSize: '0.9rem' }}
              id='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <span className='my-auto mx-3'><i className="bi bi-search"></i></span>
        </div>
        <hr />
        {error && (
        <div className="alert alert-danger" role="alert">
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
                  <th scope="col">Filtro</th>
                  <th>Ações</th>
              </tr>
          </thead>
          <tbody>
            {
              sales.map((lead) => {
                return <tr key={lead.id}>
                  <th scope="row">{lead.id}</th>
                  <td>{lead.company}</td>
                  <td>{formatDateToDDMMYYYY(lead.sale_date)}</td>
                  <td>R$ {lead.value}</td>
                  <td>{lead.seller_id}</td>
                  <td>{!lead.filled ? <i className="bi bi-x-circle"></i> : lead.filled}</td>
                  <td>{lead.filter ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}</td>
                  <td><Link to={"/checklist/0/" + lead.id}><i className="bi bi-card-checklist m-1"></i></Link></td>
                </tr>
              })
            }
          </tbody>
        </table>
        <nav aria-label="Page navigation">
          <ul className="pagination">
            {render_pages()}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Sales