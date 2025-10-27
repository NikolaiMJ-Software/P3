import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HeaderTestPage from "./pages/HeaderTestPage.jsx"
import ThemeBrowser from "./pages/ThemeBrowser.jsx";
import SubmitSSTestPage from "./pages/SubmitSSTestPage.jsx";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/header" element={<HeaderTestPage />} />
                <Route path="/themes" element={<ThemeBrowser />} />
                <Route path="/submit" element={<SubmitSSTestPage />} />
            </Routes>
        </BrowserRouter>
    );
}
