import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import ConfirmEmail from "./components/ConfirmEmail";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm/:codeParam" element={<ConfirmEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
