import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import api from "../api/api";
import NavBar from "../components/NavBar";

const Login = () => {
    const [user, setUser] = useState(null)
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userfetch = await api.get('/user/me')
                setUser(userfetch.data)
                navigate("/")    
                    
            } catch (err) {
                console.error(err)
            }
        }
        fetchUser()
    }, [navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = {
                cpf: login,
                password
            }
            const response = await api.post("/user/login", data)
 
            if ("access_token" in response.data) {
                const accessToken = response.data.access_token
                const refreshToken = response.data.refresh_token
                if (rememberMe) {
                    Cookies.set("access_token", accessToken, {secure: true, sameSite: 'Strict', expires: 30})
                    Cookies.set("refresh_token", refreshToken, {secure: true, sameSite: 'Strict', expires: 30})
                    

                } else {
                    Cookies.set("access_token", accessToken, {secure: true, sameSite: 'Strict'})
                    Cookies.set("refresh_token", refreshToken, {secure: true, sameSite: 'Strict'})
                }
                setLogin("")
                setPassword("")
                navigate("/")
            } else {
                setError("Credenciais inválidas ou seu login ainda não foi aprovado")
                setLogin("")
                setPassword("")
            }

        } catch (error) {
            setError("Ocorreu um erro... Tente novamente mais tarde")
        }

        setLoading(false)

    }

  return (
    <>
        <NavBar userData={null}/>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-x1-3">
                    <h1 className="mt-5">Login</h1>

                    {error && (<div className="alert alert-danger" role="alert">
                        {error}
                    </div>)}

                    <form className="form" onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="login" className="form-label">
                                CPF
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="login"
                                placeholder="000.000.000-00"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required maxLength={11} minLength={11}
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

                            <div className="mb-3 form-check mt-2">
                                <input type="checkbox" className="form-check-input" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                <label className="form-check-label" htmlFor="remember">Lembrar login?</label>
                            </div>

                            {!loading ? <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>:
                                        <button type="submit" className="btn btn-primary w-100 mt-2 disabled">Login</button>
                            }
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </>
  );
};

export default Login;
