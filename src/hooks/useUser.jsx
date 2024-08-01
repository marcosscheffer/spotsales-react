import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { UserContext } from "../contexts/UserContext";

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const { user, setUser } =useContext(UserContext) 

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const res = await api.get('/user/me')
                setUser(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return {user}
}

