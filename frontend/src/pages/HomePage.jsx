import {useNavigate, useParams} from "react-router-dom";
import { useEffect } from "react";
export default function HomePage() {
    const navigate = useNavigate();
    const {username} = useParams();

    useEffect(()=>{
        if(!username){
            navigate("/login")
        }
    }, [username, navigate])

    const goToMessages = () => {
        navigate(`/messages/${username}`);
    };
    const goToThemes = () => {
        navigate(`/themes/${username}`);
    }

    return <>
        <h1>Welcome to the Home Page</h1>
        <button onClick={goToMessages}>Messages</button>
        <button onClick={goToThemes}>Themes</button>
    </>
}
