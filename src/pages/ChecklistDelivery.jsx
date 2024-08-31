import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'
import NavBar from '../components/NavBar'

const ChecklistDelivery = () => {
    const { id } = useParams()
    const [user, setUser] = useState()
    const [admin, setAdmin] = useState()
    const [loading, setLoading] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [error, setError] = useState()
    
    // states for form
    const [freight, setFreight] = useState()
    const [pallet, setPallet] = useState()
    const [typeAddress, setTypeAddress] = useState()
    const [address, setAddress] = useState()
    const [deadline, setDeadline] = useState()
    const [file, setFile] = useState()
    const [ts, setTs] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('user/me')
                setUser(res.data)
                setAdmin(res.data.admin)

            } catch (err) {
                navigate('/login?next=/checklist/3/' + id)
            }
        }
        fetchUser()
    }, [navigate])

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const res = await api.get("/checklist/" + id)

                setFreight(res.data.freight)
                setPallet(res.data.pallet)
                setTypeAddress(res.data.type_address)
                setAddress(res.data.address)
                setDeadline(res.data.deadline)
                setTs(res.data.ts)

                setError("")
            } catch (err) {
                setError("Ocorreu algum Erro!")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setButtonLoading(true)
        const json_data = {
            freight,
            pallet,
            deadline,
            "type_address": typeAddress,
            "address": address || ""
        }
        try {
            await api.put("checklist/" + id, json_data)
            navigate("/checklist/4/" + id)
        } catch (e) {
            setError("Ocorreu algum problema ao enviar este checklist! Tente novamente mais tarde...")
        } finally {
            setButtonLoading(false)
        }

        if (file) {
            const formData = new FormData()
            console.log(ts)
            formData.append('file', file)
            formData.append('ts', ts)
            try {
                const res = await api.post("/slack/send/file/upload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            } catch (e) {
                setError("Ocorreu algum problema ao enviar o arquivo! Tente novamente mais tarde...")
            }
        }
    }

    if (loading) {
        return <h1>Carregando...</h1>
    }

  return (
    <>  
        <NavBar userData={user} admin={admin} />
        <div className="container bg-secondary-subtle p-4">
            <h1>Entrega</h1>
            <p>Preencha de acordo com os equipamentos que serão utilizados.</p>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form className="row g-3 mt-2" onSubmit={handleSubmit}>
                <div className="col-md-10">
                    <h2>Frete</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="freight" id="cif" value="cif" checked={freight ===  'cif'} onChange={(e) => setFreight(e.target.value)} required />
                        <label className="form-check-label" htmlFor="cif">CIF</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="freight" id="fob" value="fob" checked={freight === 'fob'} onChange={(e) => setFreight(e.target.value)} required />
                        <label className="form-check-label" htmlFor="fob">FOB</label>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Palete</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="pallet" id="pallet-yes" value="true" checked={pallet === true} onChange={(e) => setPallet(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="pallet-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="pallet" id="pallet-no" value="false" checked={pallet === false} onChange={(e) => setPallet(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="pallet-no">Não</label>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Endereço de entrega</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="address" id="sintegra" value="sintegra" checked={typeAddress === 'sintegra'}  onChange={(e) => setTypeAddress(e.target.value)} required />
                        <label className="form-check-label" htmlFor="sintegra">No Sintegra</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="address" id="other" value="other" checked={typeAddress === 'other'} onChange={(e) => setTypeAddress(e.target.value)} required />
                        <label className="form-check-label" htmlFor="other">Outro</label>
                    </div>
                    {typeAddress === 'other' && (
                        <div className="my-3">
                            <label htmlFor="address" className="form-label">Endereço</label>
                            <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                    )}
                    <div className="input-group mb-3 mt-3">
                        <input type="file" className="form-control" id="inputGroupFile01" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    <p className='text-secondary'>O arquivo será apenas enviado, e não salvo!</p>
                </div>

                <div className="col-md-10">
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Prazo de entrega</label>
                        <input type="date" className="form-control" id="address" value={deadline} onChange={(e) => setDeadline(e.target.value)}  required />
                    </div>
                </div>

                <div className="col-12">
                    <button className="btn btn-secondary m-2" onClick={() => navigate('/checklist/2/' + id)}>Voltar</button>
                    {!buttonLoading ? <button className="btn btn-primary">Proximo</button>:
                    <button className="btn btn-primary" onSubmit={handleSubmit} disabled>Proximo</button>}
 
                </div>
            </form>
        </div>
    </>
  )
}

export default ChecklistDelivery