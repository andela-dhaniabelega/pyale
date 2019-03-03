import React from 'react';
import SocialMedia from '../components/SocialMedia';
import Footer from '../components/Footer';
import FooterLinks from '../components/FooterLinks';
import Aux from '../hoc/Aux_'
import Navbar from "../components/Navbar";
import {connect} from "react-redux";
import {loadProperties} from "../store/actions/properties";
import {  withRouter } from 'react-router-dom';


class Properties extends React.Component {

  componentWillMount() {
    this.props.loadProperties()
  }

  render() {
    const { allProperties } = this.props;
    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
          <div className="bg-pattern-effect">
            <img src="images/bg-pattern.png" alt=""/>
          </div>
        </section>
        <section className="section" id="features">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h1 className="detail-section-title text-center">All Properties</h1>
                <div className="detail-section-title-border margin-t-20"></div>
              </div>
            </div>

            <div className="row margin-t-30">

              {
                allProperties && allProperties.map((property) => {
                  return (
                    <div className="col-lg-3" key={property.id}>
                      <div className="blog-box margin-t-30 hover-effect">
                        {property.property_images.map((imageItem) => {
                           if (imageItem.tag === "thumbnail"){
                             return <img src={imageItem.image_details&&imageItem.image_details.url} className="img-fluid" alt="" key={imageItem.id}/>
                           }
                        })}
                        <div>
                          <h5 className="mt-4 text-muted">{property.name}</h5>
                        </div>
                      </div>
                    </div>
                  )
                })
              }

              <div className="col-lg-3 text-center">
                <div className="margin-t-30">
                  <div className="by-type">
                    Filter by type
                    <div className="section-title-border margin-t-5 margin-b-5"></div>
                    <ul className="list-unstyled">
                      <li>Residential Only</li>
                      <li>Commercial Only</li>
                    </ul>
                  </div>
                  <div className="by-location">
                    Filter by location
                    <div className="section-title-border margin-t-5 margin-b-5"></div>
                    <ul className="list-unstyled">
                      <li>Port Harcourt</li>
                      <li><a role="button">Lagos</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* SocialMedia Component*/}
        <SocialMedia/>

        {/* Footer Component*/}
        <Footer/>

        {/* FooterLinks Component*/}
        <FooterLinks/>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allProperties: state.properties.allProperties
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProperties: () => {dispatch(loadProperties())}
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Properties));