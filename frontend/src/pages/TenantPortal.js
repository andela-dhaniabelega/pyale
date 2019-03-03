import React from 'react'
import Aux from '../hoc/Aux_';
import Navbar from "../components/Navbar";
import {connect} from "react-redux";
import {Link, Redirect, withRouter} from "react-router-dom";
import {loadUser} from "../store/actions/authActions";


class TenantPortal extends React.Component {
  state = {
    user: {}
  };

  componentWillMount() {
    if(!this.props.user) {
      this.props.loadUser()
    }
  }

  render() {
    const {isAuthenticated, user} = this.props;
     if (!isAuthenticated) {
      return <Redirect to="/login" />
    }
    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
          <div className="bg-pattern-effect">
            <img src="images/bg-pattern.png" alt=""/>
          </div>
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
                  <h4 className="padding-t-15">
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
                  <h4 className="padding-t-15">My Letting</h4>
                  <p className="padding-t-15 text-muted">Credibly brand standards compliant users without extensible
                    services. Anibh euismod tincidunt ut laoreet.</p>
                </div>
              </div>
              <div className="col-lg-4 margin-t-20">
                <div className="services-box text-center hover-effect">
                  <i className="pe-7s-edit text-custom"></i>
                  <h4 className="padding-t-15">Change Email/Password</h4>
                  <p className="padding-t-15 text-muted">Separated they live in Bookmarksgrove right at the coast of the
                    Semantics, a large language ocean necessary regelialia.</p>
                </div>
              </div>
            </div>
            <div className="row margin-t-30">
              <div className="col-lg-4 margin-t-20">
                <div className="services-box text-center hover-effect">
                  <i className="pe-7s-science text-custom"></i>
                  <h4 className="padding-t-15">Awesome Support</h4>
                  <p className="padding-t-15 text-muted">It is a paradisematic country, in which roasted parts of
                    sentences fly into your mouth leave for the far World.</p>
                </div>
              </div>
              <div className="col-lg-4 margin-t-20">
                <div className="services-box text-center hover-effect">
                  <i className="pe-7s-news-paper text-custom"></i>
                  <h4 className="padding-t-15">Truly Multipurpose</h4>
                  <p className="padding-t-15 text-muted">Even the all-powerful Pointing has no control about the blind
                    texts it is an almost unorthographic.</p>
                </div>
              </div>
              <div className="col-lg-4 margin-t-20">
                <div className="services-box text-center hover-effect">
                  <i className="pe-7s-plane text-custom"></i>
                  <h4 className="padding-t-15">Easy to customize</h4>
                  <p className="padding-t-15 text-muted">Question Marks and devious Semikoli, but the Little Blind Text
                    didn’t listen. She packed her seven versalia.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

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