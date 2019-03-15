import React from 'react'
import Aux from '../hoc/Aux_';
import Navbar from "../components/Navbar";
import {connect} from "react-redux";
import {Link, Redirect, withRouter} from "react-router-dom";
import {loadUser} from "../redux/actions/authActions";
import Footer from "../components/Footer";
import SocialMedia from "../components/SocialMedia";
import FooterLinks from "../components/FooterLinks";


class TenantPortal extends React.Component {
  state = {
    user: {}
  };

  componentWillMount() {
    if(!this.props.user) {
      this.props.loadUser().then(() => {
        if (this.props.user && !this.props.user.is_previously_logged_in) {
          this.props.history.push('/password_change')
        }
      })
    }
  }

  render() {
    const {isAuthenticated, user} = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login"/>
    }
    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
        </section>
        <section className="section pt-5" id="services">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h1 className="section-title text-center">
                  Welcome, {user && user.first_name}.
                </h1>
                <div className="section-title-border margin-t-20"></div>
                <p className="section-subtitle text-muted text-center padding-t-30 font-secondary">We craft digital,
                  graphic and dimensional thinking, to create category leading brand experiences that have meaning and
                  add a value for our clients.</p>
              </div>
            </div>
            <div className="row margin-t-30">
              <div className="col-lg-4 margin-t-20">
                <div className="services-box text-center hover-effect">
                  <i className="pe-7s-folder text-custom"></i>
                  <h4 className="padding-t-15 portal-heading">
                    <Link to="/documents">Tenancy Documents</Link>
                  </h4>
                  <p className="padding-t-15 text-muted">
                    View all documents related to your tenancy including tenancy agreements etc.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 margin-t-20">
                <div className="services-box text-center hover-effect">
                  <i className="pe-7s-home text-custom"></i>
                  <h4 className="padding-t-15 portal-heading">
                    <Link to="/documents">My Letting</Link>
                  </h4>
                  <p className="padding-t-15 text-muted">
                    Access all relevant information related to your letting
                  </p>
                </div>
              </div>
              <div className="col-lg-4 margin-t-20">
                <div className="services-box text-center hover-effect">
                  <i className="pe-7s-edit text-custom"></i>
                  <h4 className="padding-t-15 portal-heading">
                    <Link to="/settings">Edit Profile</Link>
                  </h4>
                  <p className="padding-t-15 text-muted">
                    Change your Email or Password
                  </p>
                </div>
              </div>
              <div className="col-lg-4 margin-t-20">
                <div className="services-box text-center hover-effect">
                  <i className="pe-7s-cash text-custom"></i>
                  <h4 className="padding-t-15 portal-heading">
                    <Link to="/bills">Bills</Link>
                  </h4>
                  <p className="padding-t-15 text-muted">
                    Manage all bills related to your letting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <SocialMedia/>
        <Footer/>
        <FooterLinks/>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TenantPortal));