import { useEffect, useState } from 'react'
import api from '../api/api'
import NavBar from '../components/NavBar'

const SignUp = () => {
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(null)
    const [cpf ,setCpf] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [position, setPosition] = useState("")
    const [options, setOptions] = useState(null)



    useEffect(() => {
        const fetchData = async() => {
            const res = await api.get('positions')
            setOptions(res.data)
        }
        fetchData()
    }, [])


    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)

        if (password !== confirmPassword) {
            setError("As senhas não coincidem")
            setLoading(false)
            return
        } else {
            const data = {
                cpf,
                email,
                name,
                password,
                position_id: Number(position)
            }

            try { 
                const res = await api.post('user/register', data)

                setMessage("Usuario registrado com sucesso, agora espere ate seu registro ser aprovado por um administrator")
                setError("")


            } catch (err) {
                if (err.response.status === 400) {
                    setError("E-mail ou CPF já são cadastrados")
                }
            } finally {
                setLoading(false)
                setCpf("")
                setEmail("")
                setName("")
                setPassword("")
                setConfirmPassword("")
                setPosition("")
            }
        }

        
    }

  return (
    <>
        <NavBar userData={null}/>
        <div>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-x1-3">
                    <h1 className="mt-5">Register</h1>

                    {error && (<div className="alert alert-danger" role="alert">
                                    {error}
                                </div>)}


                    {message && (<div class="alert alert-success" role="alert">
                                    {message}
                                </div>)}

                    <form className="form" onSubmit={handleSubmit} autoComplete='off'>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label mt-2">
                                Nome
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required minLength={3}
                            />

                            <label htmlFor="login" className="form-label mt-2">
                                CPF
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="cpf"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                required maxLength={11} minLength={11}
                            />

                            <label htmlFor="email" className="form-label mt-2">E-mail</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                aria-describedby="emailHelp"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            

                            <label htmlFor="password" className="form-label mt-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                aria-describedby="passwordHelpBlock"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required minLength={8}
                            />

                            <label htmlFor="confirmPassword" className="form-label mt-2">
                                Confirme sua senha
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                aria-describedby="passwordHelpBlock"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required minLength={8}
                            />

                            <div className="form-floating mt-2">
                                <select 
                                    className="form-select" 
                                    id="floatingSelect" 
                                    aria-label="Floating label select example"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}>
                                    <option value="" disabled>--- Selecione uma opção ---</option>
                                    {options && options.map((position) => (
                                        <option value={position.id} key={position.id}>{position.title}</option>
                                    ))}
                                </select>
                                <label htmlFor="floatingSelect">Selecione seu cargo</label>
                            </div>

                            {!loading ? <button type="submit" className="btn btn-primary w-100 mt-2">SignUp</button>:
                                        <button type="submit" className="btn btn-primary w-100 mt-2 disabled">SignUp</button>
                            }
                        </div>
                    </form>

                </div>
            </div>
        </div>
        </div>
    </>
  )
}

export default SignUp
