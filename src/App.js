import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header/Header';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Login from './Pages/Authentication/Login';
import Register from './Pages/Authentication/Register';
import Home from './Pages/Home/Home';
import UserDetails from './Pages/User/UserDetails';
import ProtectedRoute from './Components/ProtectedRoute';
function App() {
  return (
    <>
      <Router>
        <Header></Header>
        <Routes>
            <Route path='/auth/login' element={<Login/>}></Route>
            <Route path='/auth/register' element={<Register/>}></Route>
            <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
            <Route path='/user/details' element={<ProtectedRoute><UserDetails/></ProtectedRoute>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
