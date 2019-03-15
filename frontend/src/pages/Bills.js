import React from 'react'
import Aux from '../hoc/Aux_';
import Navbar from "../components/Navbar";
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import Footer from "../components/Footer";
import SocialMedia from "../components/SocialMedia";
import FooterLinks from "../components/FooterLinks";
import {getTenantBills} from "../redux/actions/tenant";
import PaidBills from "../components/PaidBills";
import UnPaidBills from "../components/UnPaidBills";


class Bills extends React.Component {
  state = {
    bills: [],
  };

  componentWillMount() {
    this.props.getTenantBills().then(() => {
      if (this.props.bills && this.props.bills.length > 0) {
        this.setState({bills: this.props.bills})
      }
    })
  }

  render() {
    const {isAuthenticated} = this.props;
    const {bills} = this.state;
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
                  Bills
                </h1>
                <div className="section-title-border margin-t-20"></div>
                <p className="section-subtitle text-muted text-center padding-t-30 font-secondary">
                  Manage all bills
                </p>
              </div>
              <UnPaidBills bills={bills}/>
              <PaidBills bills={bills}/>
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
    bills: state.tenant.bills,
    isAuthenticated: state.auth.isAuthenticated,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTenantBills: () => dispatch(getTenantBills())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bills));