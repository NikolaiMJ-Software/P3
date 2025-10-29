import {useNavigate, useParams} from "react-router-dom";
import { useEffect } from "react";

export default function SessionLogin(){
    const navigate = useNavigate();
    const {username: routeUsername} = useParams();

    const user = routeUsername || sessionStorage.getItem("username")

    useEffect(() => {
        if (!user) {
        navigate("/login");
        return;
        }
        if (!routeUsername && user) {
        navigate(`/${user}`, { replace: true });
        }
    }, [user, routeUsername, navigate]);

    if (!user) return null;
}