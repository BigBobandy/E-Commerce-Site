import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Home-Components/Header";
import HomePage from "./components/Home-Components/HomePage";
import ConfirmEmail from "./components/Signup-Components/ConfirmEmail";
import SignUp from "./components/Signup-Components/SignUp";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm/:codeParam" element={<ConfirmEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
