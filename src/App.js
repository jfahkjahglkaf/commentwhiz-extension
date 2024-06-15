import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Extension from "./pages/Extension";
import Settings from "./pages/Settings";
import About from "./pages/About";
import HomePage from "./pages/HomePage";
import "./App.css";
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Extension />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/settings" element={<Settings />} /> 
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default App; 
