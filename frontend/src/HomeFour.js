import React from 'react';
import Navbar from './components/Navbar';
import Services from './components/Services';
import Features from './components/Features';
import Descriptions from './components/Descriptions';
import Pricing from './components/Pricing';
import Team from './components/Team';
import Process from './components/Process';
import Testi from './components/Testi';
import Started from './components/Started';
import Blog from './components/Blog';
import Contact from './components/Contact';
import SocialMedia from './components/SocialMedia';
import Footer from './components/Footer';
import FooterLinks from './components/FooterLinks';
import Switcher from './components/Switcher';
import Aux from './hoc/Aux_';
import HomeNavBar from "./HomeTwo";
import {connect} from "react-redux";
import Sale from "./components/Sale";
import Rent from "./components/Rent";

class HomeFour extends React.Component {
  render() {

    const { isAuthenticated } = this.props;
    return (
      <Aux>
        {/* Navbar Component*/}
        {isAuthenticated ? <Navbar/> : <HomeNavBar/>}

        <section className="section bg-home home-half" id="home">
          <div className="bg-overlay"></div>
          <div className="display-table">
            <div className="display-table-cell">
              <div className="container">
                <div className="row vertical-content">
                  <div className="col-lg-8 text-white text-left margin-t-5">
                    <h2 className="home-title">We Build. We Lease. We Rent. </h2>
                    <p className="padding-t-15 home-desc">
                      Pyale Properties leases and rents commercial and residential properties at
                      affordable rates across multiple locations in Nigeria including Lagos &
                      PortHarcourt
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Sale/>
        <Rent/>
        <SocialMedia/>
        <Footer/>
        <FooterLinks/>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
};


export default connect(mapStateToProps)(HomeFour);