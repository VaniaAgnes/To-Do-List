import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ToDoList from './ToDoList.jsx';
import Register from './pages/Register'

function App(){

    return (

    <Router>
        <Routes>
        <Route path="/" element={<Register />} exact />
        </Routes>
    </Router>);
}
export default App