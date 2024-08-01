import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';

import style from './App.css'

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import Users from './pages/Users';

// Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Context
import { UserContext } from './contexts/UserContext';


function App() {
  const { user } = useContext(UserContext)

  return (
    <div className="App">
        <BrowserRouter>
          <NavBar />
          <main className='flex grow-1'>
            <Routes>
              <Route path='/login' element={!user ? <Login/> : <Navigate to="/" />} />
              <Route path='/signup' element={!user ? <SignUp/> : <Navigate to="/" />} />
              <Route path='/' element={<Home/>} />
              <Route path='/users' element={<Users/>} />
              <Route path='*' element={<NotFound/>} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
    </div>
  );
}

export default App;
