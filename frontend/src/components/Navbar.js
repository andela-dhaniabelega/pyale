import React from 'react';
import {Link, NavLink, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../redux/actions/authActions";


class Navbar extends React.Component {

  handleClick = (e) => {
    this.props.logout()
  };

  render() {
    const {isAuthenticated} = this.props;
    return (
      <div>
        <nav className="navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark">
        <div className="container">
          <a className="navbar-brand logo text-uppercase" href="/">
            Pyale Properties
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="mdi mdi-menu"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav navbar-center" id="mySidenav">
              <li className="nav-item active">
                <NavLink to="/" className="nav-link">Home</NavLink>
              </li>
              <li className="nav-item">
                <Link to="/properties" className="nav-link">All Properties</Link>
              </li>
              <li className="nav-item">
                {isAuthenticated ? (
                  <Link to="/portal" className="nav-link">Portal</Link>
                ) : (
                  <Link to="/contact" className="nav-link">Filler</Link>
                )}
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
            <div className="nav-button ml-auto">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  {!isAuthenticated ? (
                    <Link to="/login"
                          className="pd-0 read-btn btn btn-custom navbar-btn btn-rounded waves-effect waves-light">
                      Tenant Login
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-custom navbar-btn btn-rounded waves-effect waves-light"
                      onClick={this.handleClick}
                    >
                      Log out
                    </button>
                  )}
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

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout())
  }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));