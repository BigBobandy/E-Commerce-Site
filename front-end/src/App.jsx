import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import EmailConfirmation from "./components/EmailConfirmation";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm-email" element={<EmailConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
