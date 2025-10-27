import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HeaderTestPage from "./pages/HeaderTestPage.jsx"
import ThemeBrowser from "./pages/ThemeBrowser.jsx";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/messages/:username" element={<MessagesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/header" element={<HeaderTestPage />} />
                <Route path="/themes/:username" element={<ThemeBrowser />} />
                {/* User logged in paths */}
                <Route path="/:username" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}
