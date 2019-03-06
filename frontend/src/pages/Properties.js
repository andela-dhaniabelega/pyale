import React from 'react';
import SocialMedia from '../components/SocialMedia';
import Footer from '../components/Footer';
import FooterLinks from '../components/FooterLinks';
import Aux from '../hoc/Aux_'
import Navbar from "../components/Navbar";
import {connect} from "react-redux";
import {filterProperties, loadProperties} from "../store/actions/properties";
import {withRouter} from 'react-router-dom';


class Properties extends React.Component {
  state = {
    selectedCategories: [],
    selectedLocation: ""
  };

  componentWillMount() {
    this.props.loadProperties()
  }

  handleTypeChange = (e) => {
    let options = this.state.selectedCategories;
    if (e.target.checked) {
      options.push(e.target.value)
    } else {
      options = options.filter((item) => item !== e.target.value)
    }
    this.setState({selectedCategories: options})
  };

  handleLocationChange = (e) => {
    this.setState({
      selectedLocation: e.target.value
    })
  };

  handleFilter = (e) => {
    e.preventDefault();
    this.props.filterProperties(this.state)
  };

  handleClearFilter = (e) => {
    e.preventDefault();
    this.setState({
      selectedCategories: [],
      selectedLocation: ""
    }, () => {
      this.props.filterProperties(this.state)
    });
  };

  showPropertyDetail = (e) => {
    const {param} = e.target.dataset;
    this.props.history.push({
      pathname: '/detail',
      search: "?" + new URLSearchParams({propId: param}).toString()
    });
  };

  render() {
    const {allProperties} = this.props;
    return (
      <Aux>
        <Navbar />
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
        </section>
        <section className="section" id="features">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h1 className="detail-section-title text-center">All Properties</h1>
                <div className="detail-section-title-border margin-t-20"></div>
                <ul className="nav justify-content-center filter-nav">
                  <li className="nav-item">
                    <div className="nav-link f-s-14">Filter Properties:</div>
                  </li>

                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button"
                       aria-haspopup="true" aria-expanded="false">By Type</a>
                    <div className="dropdown-menu">

                      <div className="input-group dropdown-item">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <input
                              type="checkbox"
                              value="commercial"
                              checked={this.state.selectedCategories.includes('commercial')}
                              onChange={this.handleTypeChange}
                            />
                          </div>
                        </div>
                        Commercial
                      </div>

                      <div className="input-group dropdown-item">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <input
                              type="checkbox"
                              value="residential"
                              checked={this.state.selectedCategories.includes('residential')}
                              onChange={this.handleTypeChange}
                            />
                          </div>
                        </div>
                        Residential
                      </div>

                      <div className="input-group dropdown-item">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <input
                              type="checkbox"
                              value="retail"
                              checked={this.state.selectedCategories.includes('retail')}
                              onChange={this.handleTypeChange}
                            />
                          </div>
                        </div>
                        Retail
                      </div>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button"
                       aria-haspopup="true" aria-expanded="false">By Location</a>
                    <div className="dropdown-menu">
                      <div className="input-group dropdown-item">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <input
                              type="radio"
                              name="location"
                              value="all"
                              onChange={this.handleLocationChange}
                            />
                          </div>
                        </div>
                        All
                      </div>

                      <div className="input-group dropdown-item">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <input
                              type="radio"
                              name="location"
                              value="lagos"
                              checked={this.state.selectedLocation === 'lagos'}
                              onChange={this.handleLocationChange}
                            />
                          </div>
                        </div>
                        Lagos
                      </div>

                      <div className="input-group dropdown-item">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <input
                              type="radio"
                              name="location"
                              value="portharcourt"
                              checked={this.state.selectedLocation === "portharcourt"}
                              onChange={this.handleLocationChange}
                            />
                          </div>
                        </div>
                        Port Harcourt
                      </div>
                    </div>
                  </li>
                  <li className="nav-item p-l-15">
                    <button
                      type="button"
                      className=" btn-custom navbar-btn waves-effect waves-light f-s-12"
                      onClick={this.handleFilter}
                    >
                      Apply Filter
                    </button>
                    <button
                      type="button"
                      className=" btn-custom navbar-btn waves-effect waves-light f-s-12 m-l-15"
                      onClick={this.handleClearFilter}
                    >
                      Clear Filters
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="row margin-t-30">

              {
                allProperties && allProperties.map((property) => {
                  return (
                    <div className="col-lg-3" key={property.id}>
                      <div className="blog-box margin-t-30 hover-effect">
                        {property.property_images.map((imageItem) => {
                          if (imageItem.tag === "thumbnail") {
                            return <img src={imageItem.image_details && imageItem.image_details.url}
                                        className="img-fluid" alt="" key={imageItem.id}/>
                          }
                        })}
                        <div className="property-title">
                          <h5
                            className="mt-4 text-muted"
                            onClick={this.showPropertyDetail}
                            data-param={property.id}
                           >
                              {property.name}
                          </h5>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
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
    loadProperties: () => {
      dispatch(loadProperties())
    },
    filterProperties: (filters) => {
      dispatch(filterProperties(filters))
    }
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Properties));