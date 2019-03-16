import React from 'react';
import {Link} from "react-router-dom";


class HomeNavBar extends React.Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark">
        <div className="container">
          <a className="navbar-brand logo text-uppercase" href="/">
            Pyale Properties
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                  aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <i className="mdi mdi-menu"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav navbar-center" id="mySidenav">
              <li className="nav-item">
                <a href="#commercial" className="nav-link">Commercial</a>
              </li>
              <li className="nav-item">
                <a href="#retail" className="nav-link">Retail</a>
              </li>
              <li className="nav-item">
                <a href="#residential" className="nav-link">Residential</a>
              </li>
              <li className="nav-item">
                <Link to="/properties" className="nav-link">All Properties</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
            <div className="nav-button ml-auto">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Link to="/login" className="read-btn">
                    <button
                      type="button"
                      className="btn btn-custom navbar-btn btn-rounded waves-effect waves-light"
                    >
                      Tenant Login
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      </div>
    );
  }
}

export default HomeNavBar;





