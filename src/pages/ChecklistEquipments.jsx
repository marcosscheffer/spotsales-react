import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'
import NavBar from '../components/NavBar'

const ChecklistEquipments = () => {
    const { id } = useParams()
    const [data, setData] = useState()
    const [user, setUser] = useState()
    const [admin, setAdmin] = useState()
    const [showDescription, setShowDescription] = useState()
    const [eletricPanel, setEletricPanel] = useState(false)
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
            const res = await api.get("/checklist/" + id)
            setData(res.data)
        }

        fetchData()
    }, [])

    if (!data) {
        return <h1>Carregando...</h1>
    }

    const handleChange = (e) => {
        if (e.target.value === "true"){

            setShowDescription(true)
        } else {
            setShowDescription(false)
        }
    }

  return (
    <>  
        <NavBar userData={user} admin={admin} />
        <div className="container bg-secondary-subtle p-5">
            <h1>Equipamentos</h1>
            <p>Preencha de acordo com os equipamentos que serão utilizados.</p>
            <form className="row g-3 mt-2">
                <div className="col-md-10">
                    <h2>Fases</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="phase" id="three-phase" value="3" />
                        <label className="form-check-label" htmlFor="three-phase">Trifásico</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="phase" id="single-phase" value="1" />
                        <label className="form-check-label" htmlFor="single-phase">Monofásico</label>
                    </div>
                </div>


                <div className="col-md-10">
                    <label htmlFor="voltage">Voltagem</label>
                    <div class="input-group">
                        <input type="text" className="form-control" id='voltage' />
                        <div class="input-group-text">V</div>
                    </div>
                </div>

                <div className="col-md-10">
                    <label htmlFor="power">Pôtencia</label>
                    <div class="input-group">
                        <input type="text" className="form-control" id='power' />
                        <div class="input-group-text">CV</div>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Projeto Especial</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-project" id="special-project-yes" value={true} />
                        <label className="form-check-label" htmlFor="special-project-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-project" id="special-project-no" value={false} />
                        <label className="form-check-label" htmlFor="special-project-no">Não</label>
                    </div>
                </div>


                <div className="col-md-10">
                    <h2>Chave Elétrica Liga/Desliga/Botoeira</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="eletric-key" id="eletric-key-yes" value={true} />
                        <label className="form-check-label" htmlFor="eletric-key-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="eletric-key" id="eletric-key-no" value={false} />
                        <label className="form-check-label" htmlFor="eletric-key-no">Não</label>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Painel Elétrico NR-10</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-panel" id="special-panel-yes" value={true} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="special-panel-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-panel" id="special-panel-no" value={false} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="special-panel-no">Não</label>
                    </div>
                </div>

                {showDescription && (
                    <div class="form-floating">
                    <textarea class="form-control" id="description_panel"></textarea>
                    <label for="description_panel">Descrição do painel</label>
                  </div>
                )}



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
                    <button className="btn btn-primary">Proximo</button>
                </div>
            </form>
        </div>
    </>
  )
}

export default ChecklistEquipments