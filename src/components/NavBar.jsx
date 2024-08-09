import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import logo from "../assets/logo.png"

const NavBar = ( {userData, admin} ) => {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} className="d-inline-block align-top" height={40} alt="Logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {!userData ? <Link to="/signup" className="nav-link">SignUp</Link> :
                          <Link to="/" className="nav-link">Home</Link>}
            </li>
            <li className="nav-item">
              {!userData ? <Link to="/login" className="nav-link">SignIn</Link> :
                        <Link to="/sales" className="nav-link">Vendas</Link>}
              
            </li>
            {admin && (<li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Admin
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><Link to='/users' className="dropdown-item">Usuarios</Link></li>
                <li><Link to='/sellers' className="dropdown-item">Vendedores</Link></li>
              </ul>
            </li>)}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
