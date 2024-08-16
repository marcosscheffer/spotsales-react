import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'
import NavBar from '../components/NavBar'

const ChecklistEquipments = () => {
    const { id } = useParams()
    const [user, setUser] = useState()
    const [ts, setTs] = useState()
    const [admin, setAdmin] = useState()
    const [loading, setLoading] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [error, setError] = useState()

    // states for form
    const [power, setPower] = useState()
    const [phases, setPhases] = useState()
    const [voltage, setVoltage] = useState()
    const [specialProject, setSpecialProject] = useState()
    const [eletricKey, setEletricKey] = useState()
    const [eletricPanel, setEletricPanel] = useState()
    const [description, setDescription] = useState()
    const [layout, setLayout] = useState()
    const [file, setFile] = useState()

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
        setLoading(true)
        const fetchData = async () => {
            try {
                const res = await api.get("/checklist/" + id)
                setPower(res.data.power)
                setPhases(res.data.phases)
                setVoltage(res.data.voltage)
                setSpecialProject(res.data.special_project)
                setEletricKey(res.data.eletric_key)
                setEletricPanel(res.data.eletric_panel)
                setLayout(res.data.layout)
                setDescription(res.data.description)
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
            power,
            phases,
            voltage,
            "special_project": specialProject,
            "eletric_key": eletricKey,
            "eletric_panel":eletricPanel,
            "layout": layout,
            "description": description
        }
        try {
            await api.put("checklist/" + id, json_data)
            navigate("/checklist/2/" + id)
        } catch (e) {
            setError("Ocorreu algum problema ao enviar este checklist! Tente novamente mais tarde...")
        } finally {
            setButtonLoading(false)
        }

        if (file) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('ts', ts)
            try {
                const res = await api.post("/slack/send/file/upload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                console.log(res.data)
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
            <h1>Equipamentos</h1>
            <p>Preencha de acordo com os equipamentos que serão utilizados.</p>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form className="row g-3 mt-2" onSubmit={handleSubmit}>
                <div className="col-md-10">
                    <label htmlFor="power">Pôtencia</label>
                    <div className="input-group">
                        <input type="text" className="form-control" id='power'  value={power} onChange={(e) => setPower(e.target.value)} required />
                        <div className="input-group-text">CV</div>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Fases</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="phase" id="three-phase" value="3" checked={phases ===  3} onChange={(e) => setPhases(Number(e.target.value))} required />
                        <label className="form-check-label" htmlFor="three-phase">Trifásico</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="phase" id="single-phase" value="1" checked={phases === 1} onChange={(e) => setPhases(Number(e.target.value))} required />
                        <label className="form-check-label" htmlFor="single-phase">Monofásico</label>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Voltagem</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="voltage" id="voltage-127" value="127" checked={voltage === 127}  onChange={(e) => setVoltage(Number(e.target.value))} required />
                        <label className="form-check-label" htmlFor="voltage-127">127V</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="voltage" id="voltage-220" value="220" checked={voltage === 220} onChange={(e) => setVoltage(Number(e.target.value))} required />
                        <label className="form-check-label" htmlFor="voltage-220">220V</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="voltage" id="voltage-380" value="380" checked={voltage === 380} onChange={(e) => setVoltage(Number(e.target.value))} required />
                        <label className="form-check-label" htmlFor="voltage-380">380V</label>
                    </div>
                    <div className="input-group mb-3 mt-3">
                        <input type="file" className="form-control" id="inputGroupFile01" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    <p className='text-secondary'>O arquivo será apenas enviado, e não salvo!</p>
                </div>

                <div className="col-md-10">
                    <h2>Projeto Especial</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-project" id="special-project-yes" value="true" checked={specialProject === true} onChange={(e) => setSpecialProject(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="special-project-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-project" id="special-project-no" value="false" checked={specialProject === false} onChange={(e) => setSpecialProject(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="special-project-no">Não</label>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Chave Elétrica Liga/Desliga/Botoeira</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="eletric-key" id="eletric-key-yes" value="true" checked={eletricKey === true} onChange={(e) => setEletricKey(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="eletric-key-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="eletric-key" id="eletric-key-no" value="false" checked={eletricKey === false} onChange={(e) => setEletricKey(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="eletric-key-no">Não</label>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Painel Elétrico NR-10</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-panel" id="special-panel-yes" value="true" checked={eletricPanel === true} onChange={(e) => setEletricPanel(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="special-panel-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-panel" id="special-panel-no" value="false" checked={eletricPanel === false} onChange={(e) => setEletricPanel(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="special-panel-no">Não</label>
                    </div>
                </div>

                {eletricPanel && (
                    <div className="form-floating">
                        <textarea className="form-control" id="description_panel" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        <label htmlFor="description_panel" className='mx-1'>Descrição do painel</label>
                    </div>
                )}

                <div className="col-md-10">
                    <h2>Layout</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="layout" id="layout-yes" value="true" checked={layout === true} onChange={(e) => setLayout(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="layout-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="layout" id="layout-no" value="false" checked={layout === false} onChange={(e) => setLayout(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="layout-no">Não</label>
                    </div>
                </div>

                <div className="col-12">
                    {!buttonLoading ? <button className="btn btn-primary">Proximo</button>:
                    <button className="btn btn-primary" onSubmit={handleSubmit} disabled>Proximo</button>}
                    
                </div>
            </form>
        </div>
    </>
  )
}

export default ChecklistEquipments