import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'

import NavBar from '../components/NavBar'

const ChecklistGeneral = () => {
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(null)
    const [data, setData] = useState()
    const [error, setError] = useState()
    const { id } = useParams()


    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('user/me')
                setUser(res.data)
                setAdmin(res.data.admin)

            } catch (err) {
                navigate('/login')
            }
        }
        fetchUser()
    }, [navigate])

    useEffect(() => {
        const fetchData = async () => {
            
            const res = await api.get("/leadsSales/" + id)
            console.log(res.data)
            setData(res.data)
        }
        fetchData()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const json_data = {
                "id": data.id,
                "seller_id": data.seller_id,
                "sale_date": data.sale_date,
                "value": data.value,
            }
            await api.post("/checklist", json_data)
            navigate("/checklist/1/" + data.id)
        } catch (err) {
            setError("Ocorreu algum problema!")
        }
    }

   
    
    if (!data) {
        return <h1>Loading...</h1>
    }
  return (
    <>
        <NavBar userData={user} admin={admin}/>
        <div className="container bg-secondary-subtle p-5">
            <h1>checklist</h1>
            <p>Verifique se os dados da venda estão corretos antes de prosseguir.</p>
            {error && (
            <div class="alert alert-danger" role="alert">
                {error}
            </div>
            )}
            <form className="row g-3 mt-2">
                <div className="col-md-2">
                    <label htmlFor="id" className="form-label"><b>#</b></label>
                    <input type="text" className="form-control" id="id" value={data.id} readOnly />
                </div>
                <div className="col-md-10">
                    <label htmlFor="client" className="form-label">Cliente</label>
                    <input type="text" className="form-control" id="client" value={data.company} readOnly />
                </div>
                <div className="col-12">
                    <label htmlFor="seller" className="form-label">Vendedor</label>
                    <input type="text" className="form-control" id="seller" value={data.seller_name} readOnly />
                </div>
                <div className="col-12">
                    <label htmlFor="saleDate" className="form-label">Data de venda</label>
                    <input type="text" className="form-control" id="saleDate" value={data.sale_date} readOnly />
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" onClick={handleSubmit}>Proximo</button>
                </div>
            </form>
        </div>
    </>
  )
}

export default ChecklistGeneral