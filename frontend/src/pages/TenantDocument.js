import React from 'react'
import {connect} from "react-redux";
import Aux from '../hoc/Aux_';
import Navbar from '../components/Navbar';
import {getTenantDocuments} from "../redux/actions/tenant";
import {Redirect} from "react-router-dom";
import {DocumentItem} from "../components/DocumentItem";
import {Alert} from "../components/Alert";


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
    const {isAuthenticated} = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login"/>
    }
    let tenantDocuments;

    if (this.state.isLoading) {
      tenantDocuments = <Alert message="Loading Documents..."/>
    } else {
      if (this.state.documents.length === 0) {
        tenantDocuments = <Alert message="No Documents added"/>
      } else {
        tenantDocuments = <DocumentItem document={this.state.documents}/>
      }
    }

    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
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
                  its layout.
                </p>
              </div>
            </div>
              {
                tenantDocuments
              }
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