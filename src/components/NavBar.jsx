import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import { useUser } from "../hooks/useUser";
import { UserContext } from "../contexts/UserContext";

import logo from "../assets/logo.png"

const NavBar = () => {

  const { user } = useContext(UserContext)

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
              {!user ? <Link to="/login" className="nav-link">SignIn</Link> :
                        <Link to="/users" className="nav-link">Usuarios</Link>}
              
            </li>
            <li className="nav-item">
              {!user ? <Link to="/signup" className="nav-link">SignUp</Link> :
                          <Link to="/signup" className="nav-link">Home</Link>}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
