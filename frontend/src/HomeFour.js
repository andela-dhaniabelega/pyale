import React from 'react';
import Navbar from './components/Navbar';
import SocialMedia from './components/SocialMedia';
import Footer from './components/Footer';
import FooterLinks from './components/FooterLinks';
import Aux from './hoc/Aux_';
import HomeNavBar from "./HomeTwo";
import {connect} from "react-redux";
import Commercial from "./components/Commercial";
import Residential from "./components/Residential";
import {loadProperties} from "./store/actions/properties";
import Retail from "./components/Retail";

class HomeFour extends React.Component {
  state = {
    retail: [],
    commercial: [],
    residential: []
  };


  componentWillMount() {
    this.props.loadProperties().then(() => {
      const {allProperties} = this.props;
      if (allProperties) {
        const retail = allProperties.filter((property) => {
          return property.category === 'retail'
        });
        const commercial = allProperties.filter((property) => {
          return property.category === 'commercial'
        });
        const residential = allProperties.filter((property) => {
          return property.category === 'residential'
        });

        this.setState({
          retail: retail.length <= 3 ? retail : retail.slice(0, 3),
          commercial: commercial.length <= 3 ? commercial : commercial.slice(0, 3),
          residential: residential.length <= 3 ? residential : residential.slice(0, 3)
        })
      }
    });
  }

  render() {
    const {isAuthenticated} = this.props;
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
        <Commercial properties={this.state.commercial}/>
        <Residential properties={this.state.residential}/>
        <Retail properties={this.state.retail}/>
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
    allProperties: state.properties.allProperties
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProperties: () => dispatch(loadProperties())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFour);