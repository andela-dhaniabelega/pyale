import React from 'react';
import SocialMedia from "./SocialMedia";
import Footer from "./Footer";
import FooterLinks from "./FooterLinks";
import Aux from '../hoc/Aux_'
import Navbar from "./Navbar"
import {connect} from "react-redux";
import {sendEnquiryEmail} from "../redux/actions/email";


class Contact extends React.Component {
  state = {
    message: "",
    subject: "",
    name: "",
    email: "",
    isLoading: false
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };

  handleSendEmail = (e) => {
    e.preventDefault();
    this.setState({isLoading: true});
    this.props.sendEnquiryEmail(this.state).then(() => {
      if (this.props.enquiryEmailSent) {
        this.setState({
          message: "",
          subject: "",
          name: "",
          email: "",
          isLoading: false
        })
      }
    })
  };

  render() {
    const {enquiryEmailSent} = this.props;
    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
        </section>
        <section className="section" id="contact">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h1 className="section-title text-center">Get In Touch</h1>
                <div className="section-title-border margin-t-20"></div>
                {/*<p className="section-subtitle text-muted text-center font-secondary padding-t-30">We thrive when coming*/}
                {/*up with innovative ideas but also understand that a smart concept should be supported with measurable*/}
                {/*results.</p>*/}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <div className="mt-4 pt-4">
                  <p className="mt-4"><span className="h5">Phone Number:</span><br/> <span
                    className="text-muted d-block mt-2">+234 818 817 5030</span></p>
                  <p className="mt-4"><span className="h5">Working Hours:</span><br/> <span
                    className="text-muted d-block mt-2">9:00AM To 6:00PM</span></p>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="custom-form mt-4 pt-4">
                  <div id="message"></div>
                  <form method="post" action="home-one" name="contact-form" id="contact-form">
                        {
                          enquiryEmailSent &&
                          <div className="alert alert-success" role="alert">
                            Email Sent Successfully
                          </div>
                        }
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group mt-2">
                          <input
                            name="name"
                            id="name"
                            type="text"
                            className="form-control"
                            placeholder="Name*"
                            value={this.state.name}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group mt-2">
                          <input
                            name="email"
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="Email*"
                            value={this.state.email}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                          <input
                            type="text"
                            className="form-control"
                            id="subject"
                            placeholder="Subject*"
                            value={this.state.subject}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                        <textarea
                          name="message"
                          id="message"
                          rows="4"
                          className="form-control"
                          placeholder="Message*"
                          value={this.state.message}
                          onChange={this.handleChange}
                        >
                        </textarea>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 text-right">
                        <input
                          type="submit"
                          id="submit"
                          name="send"
                          className="submitBnt btn btn-custom"
                          value={this.state.isLoading ? "Sending..." : "Send Message"}
                          onClick={this.handleSendEmail}
                        />
                        <div id="simple-msg"></div>
                      </div>
                    </div>
                  </form>
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
    enquiryEmailSent: state.email.enquiryEmailSent
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendEnquiryEmail: (payload) => dispatch(sendEnquiryEmail(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Contact);