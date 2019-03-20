import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import SocialMedia from '../components/SocialMedia';
import Footer from '../components/Footer';
import FooterLinks from '../components/FooterLinks';
import Aux from '../hoc/Aux_'
import Navbar from "../components/Navbar";
import {connect} from "react-redux";
import queryString from 'query-string';
import {getProperty} from "../redux/actions/properties";


class PropertyDetail extends React.Component {
  state = {
    singleProperty: {},
    propertyImages: []
  };

  componentWillMount() {
    const parsed = queryString.parse(window.location.search);
    this.props.getProperty(parsed.propId)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {singleProperty} = nextProps;
    let propertyImages;

    if (singleProperty) {
      propertyImages = singleProperty.property_images.filter((image) => {
        return image.tag === 'thumbnail'
      });
      this.setState({
        singleProperty,
        propertyImages
      })
    }
  }

  render() {
    const {singleProperty, propertyImages} = this.state;
    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
        </section>
        <section className="section" id="features">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h1 className="detail-section-title text-center">{singleProperty && singleProperty.name}</h1>
                <div className="detail-section-title-border margin-t-20"></div>
              </div>
            </div>

            <div className="row vertical-content">
              <div className="col-lg-5">
                <div className="features-box">
                  <h3>A digital web design studio creating modern & engaging online experiences</h3>
                  <p className="text-muted web-desc">Separated they live in Bookmarksgrove right at
                    the coast of the
                    Semantics, a large language ocean. A small river named Duden flows by their
                    place and supplies it
                    with the necessary regelialia.</p>
                  <ul className="text-muted list-unstyled margin-t-30 features-item-list">
                    <li className="">We put a lot of effort in design.</li>
                    <li className="">The most important ingredient of successful website.</li>
                    <li className="">Sed ut perspiciatis unde omnis iste natus error sit.</li>
                    <li className="">Submit Your Orgnization.</li>
                  </ul>
                  <Link to="JavaScript:Void(0);"
                        className="btn btn-custom margin-t-30 waves-effect waves-light">Learn
                    More <i className="mdi mdi-arrow-right"></i></Link>
                </div>
              </div>
              <div className="col-lg-7">
                {/*<div className="features-img features-right text-right">*/}
                {/*<img src="images/online-world.svg" alt="macbook image" className="img-fluid" />*/}
                {/*</div>*/}
                <div className="property-slider owl-carousel owl-theme">
                  {
                    propertyImages && propertyImages.map((image) => {
                      return <div> <img src={image.image_details.url} alt=""/> </div>
                    })
                  }
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

const matchStateToProps = (state) => {
  return {
    singleProperty: state.properties.singleProperty
  }
};

const matchDispatchToProps = (dispatch) => {
  return {
    getProperty: (property_id) => dispatch(getProperty(property_id))
  }
};


export default connect(matchStateToProps, matchDispatchToProps)(PropertyDetail);