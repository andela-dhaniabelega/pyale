import React from 'react';

import HomeNavBar from './components/HomeNavBar';
import Sale from './components/Sale';
import Rent from './components/Rent';
import SocialMedia from './components/SocialMedia';
import Footer from './components/Footer';
import FooterLinks from './components/FooterLinks';
import Switcher from './components/Switcher';
import Aux from './hoc/Aux_';
import {connect} from "react-redux";
import Navbar from "./components/Navbar";


class HomeTwo extends React.Component {
  render() {
    const {isAuthenticated} = this.props
    var bkg1 = {
      backgroundImage: 'url(images/wave-shape/wave1.png)',
    };
    var bkg2 = {
      backgroundImage: 'url(images/wave-shape/wave2.png)',
    };
    var bkg3 = {
      backgroundImage: 'url(images/wave-shape/wave3.png)',
    };

    return (
      <Aux>
        {/* Navbar Component, if logged in show TenantNavBar else use HomeNavBar*/}
        {isAuthenticated ? <Navbar/> : <HomeNavBar/>}

        <section className="section bg-home home-half" id="home" data-image-src="images/bg-home.jpg">
          <div className="bg-overlay"></div>
          <div className="display-table">
            <div className="display-table-cell">
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 offset-lg-2 text-white text-center">
                    <h1 className="home-title">We Build. We Lease. We Rent. </h1>
                    <p className="padding-t-15 home-desc">
                      Pyale Properties leases and rents commercial and residential properties at
                      affordable rates across multiple locations in Nigeria including Lagos &
                      PortHarcourt
                    </p>
                    <p className="play-shadow margin-t-30 margin-l-r-auto"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="wave-effect wave-anim">
            <div className="waves-shape shape-one">
              <div className="wave wave-one" style={bkg1}></div>
            </div>
            <div className="waves-shape shape-two">
              <div className="wave wave-two" style={bkg2}></div>
            </div>
            <div className="waves-shape shape-three">
              <div className="wave wave-three" style={bkg3}></div>
            </div>
          </div>
        </section>
        {/* Blog Component*/}
        <Sale/>

        {/* Blog Component*/}
        <Rent/>

        {/* SocialMedia Component*/}
        <SocialMedia/>

        {/* Footer Component*/}
        <Footer/>

        {/* FooterLinks Component*/}
        <FooterLinks/>

        {/* Switcher Component*/}
        <Switcher/>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
};

export default connect(mapStateToProps)(HomeTwo);