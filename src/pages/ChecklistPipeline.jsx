import React, { useState, useEffect } from 'react'
import { json, useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'
import NavBar from '../components/NavBar'

const ChecklistPipeline = () => {
    const { id } = useParams()
    const [user, setUser] = useState()
    const [admin, setAdmin] = useState()
    const [loading, setLoading] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [error, setError] = useState()

    // states for form
    const [pipeline, setPipeline] = useState()
    const [description, setDescription] = useState("")
    const [specialPaint, setSpecialPaint] = useState()
    const [extraFilters, setExtraFilters] = useState()
    const [assembly, setAssembly] = useState()
    const [resposibleAssembly, setResposibleAssembly] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('user/me')
                setUser(res.data)
                setAdmin(res.data.admin)

            } catch (err) {
                navigate('/login?next=/checklist/2/' + id)
            }
        }
        fetchUser()
    }, [id, navigate])

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const res = await api.get("/checklist/" + id)
                setPipeline(res.data.pipeline)
                setDescription(res.data.description_pipeline)
                setSpecialPaint(res.data.special_paint)
                setExtraFilters(res.data.extra_filters)
                setAssembly(res.data.assembly)
                setResposibleAssembly(res.data.responsible_assembly)
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
            pipeline,
            assembly,
            "responsible_assembly": resposibleAssembly || "",
            "description_pipeline": description || "",
            "special_paint": specialPaint,
            "extra_filters": extraFilters,
        }
        try {
            await api.put("checklist/" + id, json_data)
            navigate("/checklist/3/" + id)
        } catch (e) {
            setError("Ocorreu algum problema ao enviar este checklist! Tente novamente mais tarde...")
        } finally {
            setButtonLoading(false)
        }

        
    }

    if (loading) {
        return <h1>Carregando...</h1>
    }

  return (
    <>  
        <NavBar userData={user} admin={admin} />
        <div className="container bg-secondary-subtle p-4">
            <h1>Tubulação</h1>
            <p>Preencha de acordo com os equipamentos que serão utilizados.</p>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form className="row g-3 mt-2" onSubmit={handleSubmit}>
                <div className="col-md-10">
                    <h2>Tubulação</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="pipeline" id="pipeline-yes" value="true" checked={pipeline === true} onChange={(e) => setPipeline(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="pipeline-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="pipeline" id="pipeline-no" value="false" checked={pipeline === false} onChange={(e) => setPipeline(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="pipeline-no">Não</label>
                    </div>
                </div>
                {pipeline && (
                    <div className="form-floating">
                        <textarea className="form-control" id="description_pipeline"  maxLength="255" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        <label htmlFor="description_pipeline" className='mx-1'>Descrição da Tubulação</label>
                    </div>
                )}

                <div className="col-md-10">
                    <h2>Pintura Especial</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-paint" id="special-paint-yes" value="true" checked={specialPaint === true} onChange={(e) => setSpecialPaint(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="special-paint-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="special-paint" id="special-paint-no" value="false" checked={specialPaint === false} onChange={(e) => setSpecialPaint(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="special-paint-no">Não</label>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Filtros Extras</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="extra-filters" id="extra-filters-yes" value="true" checked={extraFilters === true} onChange={(e) => setExtraFilters(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="extra-filters-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="extra-filters" id="extra-filters-no" value="false" checked={extraFilters === false} onChange={(e) => setExtraFilters(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="extra-filters-no">Não</label>
                    </div>
                </div>

                <div className="col-md-10">
                    <h2>Montagem</h2>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="assembly" id="assembly-yes" value="true" checked={assembly === true} onChange={(e) => setAssembly(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="assembly-yes">Sim</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="assembly" id="assembly-no" value="false" checked={assembly === false} onChange={(e) => setAssembly(e.target.value === "true" ? true : false)} required />
                        <label className="form-check-label" htmlFor="assembly-no">Não</label>
                    </div>
                </div>

                {assembly && (
                    <div className="col-md-10">
                        <h2>Responsavel pela montagem</h2>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="responsible-assembly" id="tm" value="tm" checked={resposibleAssembly === "tm"}  onChange={(e) => setResposibleAssembly(e.target.value)} required />
                            <label className="form-check-label" htmlFor="tm">TM</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="responsible-assembly" id="client" value="client" checked={resposibleAssembly === "client"} onChange={(e) => setResposibleAssembly(e.target.value)} required />
                            <label className="form-check-label" htmlFor="client">Cliente</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="responsible-assembly" id="outsourced" value="outsourced" checked={resposibleAssembly === "outsourced"} onChange={(e) => setResposibleAssembly(e.target.value)} required />
                            <label className="form-check-label" htmlFor="outsourced">Terceirizado</label>
                        </div>
                    </div>
                )}

                

                

                <div className="col-12">
                    <button className="btn btn-secondary m-2" onClick={(e) => navigate("/checklist/1/" + id)}>Voltar</button>
                    {!buttonLoading ? <button className="btn btn-primary">Proximo</button>:
                    <button className="btn btn-primary" onSubmit={handleSubmit} disabled>Proximo</button>}

                    
                </div>
            </form>
        </div>
    </>
  )
}

export default ChecklistPipeline