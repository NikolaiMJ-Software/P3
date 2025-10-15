import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    const goToMessages = () => {
        navigate("/messages");
    };

    return <>
        <h1>Welcome to the Home Page</h1>
        <button onClick={goToMessages}>Messages</button>
    </>
}
