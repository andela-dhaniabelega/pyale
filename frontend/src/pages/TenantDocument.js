import React from 'react'
import {connect} from "react-redux";
import Aux from '../hoc/Aux_';
import Navbar from '../components/Navbar';
import {getTenantDocuments} from "../store/actions/tenant";
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import {Redirect} from "react-router-dom";


class TenantDocument extends React.Component {
  state = {
    documents: [],
    isLoading: true
  };

  componentWillMount() {
    this.props.getTenantDocuments()
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {documents} = nextProps;
    if (documents) {
      this.setState({
        documents,
        isLoading: false
      })
    }
  }

  render() {
    const { isAuthenticated } = this.props;
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
        <section className="section pt-4" id="team">
          <div className="container">
            {/*<div className="loading text-center">*/}
              {/*{this.state.isLoading && "Loading Documents..."}*/}
            {/*</div>*/}
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h1 className="section-title text-center">Tenancy Documents</h1>
                <div className="section-title-border margin-t-20"></div>
                <p className="section-subtitle text-muted text-center font-secondary padding-t-30">It is a long
                  established fact that a reader will be distracted by the readable content of a page when looking at
                  its layout.</p>
              </div>
              <div className="row margin-t-50">
                {
                  this.state.documents && this.state.documents.map((item) =>  {
                    return (
                       <div className="col-lg-3 col-sm-6">
                        <div className="team-box text-center hover-effect">
                            <div className="team-wrapper">
                                <div className="team-member">
                                    <img alt="" src="images/team/img-1.png" className="img-fluid rounded" />
                                </div>
                            </div>
                            <h4 className="team-name"></h4>
                            <p className="text-uppercase team-designation">
                              <a href={item.document}>{item.name}</a>
                            </p>
                        </div>
                    </div>
                    )
                  })
                }
                </div>
            </div>
          </div>
        </section>
      </Aux>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    documents: state.tenant.documents,
    isAuthenticated: state.auth.isAuthenticated
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTenantDocuments: () => dispatch(getTenantDocuments())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantDocument)