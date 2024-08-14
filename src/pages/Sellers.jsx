import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import api from '../api/api'
import { useNavigate, Link } from'react-router-dom'

const Sellers = () => {
    const [user, setUser] = useState()
    const [admin, setAdmin] = useState()
    const [update, setUpdate] = useState()
    const [error, setError] = useState()
    const [sellers, setSellers] = useState([])
    const [add, setAdd] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [id, setId] = useState()
    const navigate = useNavigate()
    

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userfetch = await api.get('/user/me')
                setUser(userfetch.data)
                setAdmin(userfetch.data.admin)
            } catch(err) {
                console.error(err)
                navigate("/login")
            }
        }
        fetchUser()
    }, [navigate])

    useEffect(() => {
        const fetchsellers = async () => {
            try {
                const res = await api.get('sellers')
                setSellers(res.data)
            } catch {
                console.error('Error fetching sales')
            }
        }
        fetchsellers()
    }, [update])

    const handleAdd = () => {
        setAdd(!add)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const seller = {id: Number(id), first_name: firstName, last_name: lastName, email }
        try {
            const res = await api.post('sellers', seller)
            if (res.status === 201) {
                setAdd(false)
                setUpdate(seller)
            }
            
        } catch (err) {
            setError("Algo deu errado... Tente Novamente!")
        } finally {
            setId("")
            setFirstName("")
            setLastName("")
            setEmail("")
        }
    }

  return (
    <>
        <NavBar userData={user} admin={admin} />
        <div className='container'>
            <h1>Vendedores</h1>
            <p>Lista de vendedores do Exact-Sales</p>
            {error && (
              <div class="alert alert-danger" role="alert">
                {error}
              </div>
              
            )}

            {add && (
                <form className='form'>
                    <div className="row g-3">
                        <div className="col-sm-2">
                            <input type="number" 
                            name="sellerId" 
                            id="sellerId" 
                            className='form-control form-icon-none' 
                            placeholder='ID' 
                            min={0} 
                            value={id} 
                            onChange={(e) => setId(e.target.value)}
                            required/>
                        </div>
                        <div className="col-sm-5">
                            <input type="text" 
                            name="firstName" 
                            id="firstName" 
                            className='form-control' 
                            placeholder='Nome'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} 
                            required/>
                        </div>
                        <div className="col-sm-5">
                            <input type="text" 
                            name="lastName" 
                            id="lastName" 
                            className='form-control' 
                            placeholder='Sobrenome'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} 
                            required/>

                        </div>
                    </div>
                    <div className="mb-3 my-3">
                        <input type="email" 
                        className="form-control" 
                        id="email" 
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required/>
                    </div>

                    <button className='btn btn-danger m-1 px-3' onClick={handleAdd}>Cancelar</button>
                    <button className='btn btn-success m-1 px-3' onClick={handleSubmit}>Adicionar</button>
                </form>
            )}

            {!add && <button className='btn btn-primary m-3 px-3' onClick={handleAdd}>Adicionar</button> }
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Sobrenome</th>
                        <th scope="col">Data de Criação (UTC)</th>
                        <th scope="col">Ativo</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    sellers.map((seller) => {
                        return <tr key={seller.id}>
                        <th scope="row">{seller.id}</th>
                        <td>{seller.first_name}</td>
                        <td>{seller.last_name}</td>
                        <td>{seller.created_at}</td>
                        <td>{seller.active ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}</td>
                        <td><Link>{!seller.active ? <i className="bi bi-check-circle m-1"></i> :
                                                    <i className="bi bi-x-circle m-1"></i>}</Link>
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

export default Sellers