import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    const goToMessages = () => {
        navigate("/messages");
    };
    const goToThemes = () => {
        navigate("/themes");
    }

    return <>
        <h1>Welcome to the Home Page</h1>
        <button onClick={goToMessages}>Messages</button>
        <button onClick={goToThemes}>Themes</button>
    </>
}
