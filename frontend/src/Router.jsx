import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import HeaderTestPage from "./pages/HeaderTestPage.jsx"

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/header" element={<HeaderTestPage />} />
            </Routes>
        </BrowserRouter>
    );
}
