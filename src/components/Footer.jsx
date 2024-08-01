import React from 'react';

const Footer = () => {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
        <span className="mb-3 mb-md-0 text-muted mx-5">© 2024, TM Máquinas</span>
      </div>
      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex mx-5">
        <li className="ms-3">
          <a className="text-muted" href="https://www.instagram.com/tm.maquinas/" target='_blank'>
            <i className="bi bi-instagram"></i>
          </a>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="https://www.facebook.com/TMmaquinas" target='_blank'>
            <i className="bi bi-facebook"></i>
          </a>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="https://www.linkedin.com/company/tmmaquinas/" target='_blank'>
            <i className="bi bi-linkedin"></i>
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
