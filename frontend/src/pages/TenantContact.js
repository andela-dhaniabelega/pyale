import React from 'react';
import SocialMedia from "../components/SocialMedia";
import Footer from "../components/Footer";
import FooterLinks from "../components/FooterLinks";
import Aux from '../hoc/Aux_'
import Navbar from "../components/Navbar"
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {sendSupportEmail} from "../store/actions/email";


class TenantContact extends React.Component {
  state = {
    message: "",
    subject: "",
    first_name: this.props.user.first_name,
    last_name: this.props.user.last_name,
    email: this.props.user.email
  };

   handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };

  handleSendEmail = (e) => {
    e.preventDefault();
    this.props.sendSupportEmail(this.state)
  };

  render() {
    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
        </section>
        <section className="height-100vh">
          <div className="display-table">
            <div className="display-table-cell">
              <div className="container m-t--250">
                <div className="row justify-content-center">
                  <div className="col-lg-7">
                    <div className="card account-card">
                      <div className="card-body">
                        <div className="text-center mt-3">
                          <h3 className="font-weight-bold">
                            <Link
                              to="home-one"
                              className="text-dark text-uppercase account-pages-logo"
                            >Contact Support
                            </Link>
                          </h3>
                          <p className="text-muted">
                            Please let us know what you need. Kindly fill the form below and we'll get back to you
                            within 3 days.
                          </p>
                        </div>
                        <div className="p-3">
                          <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                              <label htmlFor="email">Subject:</label>
                              <input
                                type="text"
                                className="form-control"
                                id="subject"
                                placeholder="Enter subject"
                                onChange={this.handleChange}
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="message">Message:</label>
                              <textarea
                                name="message"
                                id="message"
                                rows="4"
                                cols="4"
                                className="form-control tenant-contact-ta"
                                placeholder="Please include the address of your letting"
                                onChange={this.handleChange}
                              ></textarea>
                            </div>

                            <div className="mt-3">
                              <button
                                type="submit"
                                className="btn btn-custom btn-block"
                                onClick={this.handleSendEmail}
                              >
                                Send Message
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
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

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendSupportEmail: (payload) => dispatch(sendSupportEmail(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantContact);