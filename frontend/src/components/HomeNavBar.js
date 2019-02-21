import React from 'react';
import {Link} from "react-router-dom";


class HomeNavBar extends React.Component {
  render() {
  	return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark">
            <div className="container">
                <a className="navbar-brand logo text-uppercase" href="/home-one">
                    Pyale Properties
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="mdi mdi-menu"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav navbar-center" id="mySidenav">
                        <li className="nav-item active">
                            <a href="#home" className="nav-link">Home</a>
                        </li>
                        <li className="nav-item">
                            <a href="#sale" className="nav-link">For Sale</a>
                        </li>
                        <li className="nav-item">
                            <a href="#rent" className="nav-link">For Rent</a>
                        </li>
                        <li className="nav-item">
                            <a href="#contact" className="nav-link">Contact</a>
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
  	);
  }
}

export default HomeNavBar;