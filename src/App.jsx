import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import axios from 'axios';
import Cookies from 'js-cookie';

import style from './App.css'

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import Users from './pages/Users';
import Sellers from './pages/Sellers';
import ChecklistGeneral from './pages/ChecklistGeneral';
import ChecklistEquipments from './pages/ChecklistEquipments';

// Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Sales from './pages/Sales';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <main className='flex grow-1'>
            <Routes>
                <Route path='/login' element={<Login/>} />
                <Route path='/signup' element={<SignUp/>} />
                <Route path='/' element={<Home/>} />
                <Route path='/users' element={<Users/>} />]
                <Route path='/sellers' element={<Sellers/>} />]
                <Route path='/sales' element={<Sales/>} />
                <Route path='*' element={<NotFound/>} />
                <Route path='/checklist/0/:id' element={<ChecklistGeneral/>} />
                <Route path='/checklist/1/:id' element={<ChecklistEquipments/>} />
            </Routes>
          </main>
          <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
