import React from 'react'
import {connect} from "react-redux";
import Aux from '../hoc/Aux_';
import Navbar from '../components/Navbar';
import {Redirect} from "react-router-dom";
import {changeEmail, changePassword} from "../redux/actions/authActions";


class TenantDocument extends React.Component {
  state = {
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
    email: "",
    isValidEmail: true
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };

  handleChangePassword = (e) => {
    e.preventDefault();
    this.props.changePassword(this.state).then(() => {
      if (this.props.passwordChangeComplete) {
        this.setState({
          currentPassword: "",
          newPassword: "",
          newPasswordRepeat: "",
        })
      }
    })
  };

  handleChangeEmail = (e) => {
    e.preventDefault();
    if (/^.+@.+\..+$/.test(this.state.email)) {
      this.props.changeEmail(this.state.email, this.props.user.id).then(() => {
        if (this.props.emailChangeComplete) {
          this.setState({
            email: "",
            isValidEmail: true
          })
        }
      })
    } else {
      this.setState({
        isValidEmail: false
      })
    }
  };

  render() {
    const {
      isAuthenticated,
      passwordChangeComplete,
      passwordChangeIncomplete,
      emailChangeComplete,
      emailChangeIncomplete
    } = this.props;

    if (!isAuthenticated) {
      return <Redirect to="/login"/>
    }
    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
        </section>
        <section className="section pt-4" id="team">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h1 className="section-title text-center">Edit Profile</h1>
                <div className="section-title-border margin-t-20"></div>
                <p className="section-subtitle text-muted text-center font-secondary padding-t-30">
                  Change your email address or password using the form below.
                </p>
              </div>
              <div className="row margin-t-50 col-lg-8 offset-lg-3">
                <div className="w-80">
                  <div className="p-3">
                    {
                      emailChangeComplete ? (
                        <div className="alert alert-success" role="alert">
                          Email changed successfully.
                        </div>
                      ) : (
                        <div className="alert alert-info" role="alert">
                          Change Email.
                        </div>
                      )
                    }
                    {
                      emailChangeIncomplete ? (
                        <div className="alert alert-warning" role="alert">
                          Something went wrong. Please try again
                        </div>
                      ) : ""
                    }
                    { !this.state.isValidEmail ? <div className="red">Please Enter a valid email address</div> : ""}
                    <form>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          id="email"
                          value={this.state.email}
                          placeholder="Enter Email"
                          onChange={this.handleChange}
                        />
                      </div>

                      <div className="mt-3">
                        <button
                          type="submit"
                          className="btn btn-custom btn-block"
                          onClick={this.handleChangeEmail}
                        >
                          Change Email
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <hr/>
              <div className="row margin-t-50 col-lg-8 offset-lg-3">
                <div className="w-80">
                  <div className="p-3">
                    {
                      passwordChangeComplete ? (
                        <div className="alert alert-success" role="alert">
                          Password Changed Successfully
                        </div>
                      ) : (
                        <div className="alert alert-info" role="alert">
                          Change Password
                        </div>
                      )
                    }
                    {
                      passwordChangeIncomplete ? (
                        <div className="alert alert-warning" role="alert">
                          Invalid Password. Please try again
                        </div>
                      ) : ""
                    }
                    <form>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control"
                          value={this.state.currentPassword}
                          id="currentPassword"
                          placeholder="Current Password"
                          onChange={this.handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control"
                          value={this.state.newPassword}
                          id="newPassword"
                          placeholder="New Password"
                          onChange={this.handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control"
                          value={this.state.newPasswordRepeat}
                          id="newPasswordRepeat"
                          placeholder="Re-Enter New Password"
                          onChange={this.handleChange}
                        />
                      </div>

                      <div className="mt-3">
                        <button
                          type="submit"
                          className="btn btn-custom btn-block"
                          onClick={this.handleChangePassword}
                        >
                          Reset your Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
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
    passwordChangeComplete: state.authReset.passwordChangeComplete,
    passwordChangeIncomplete: state.authReset.passwordChangeIncomplete,
    emailChangeComplete: state.authReset.emailChangeComplete,
    emailChangeInComplete: state.authReset.emailChangeInComplete,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePassword: (credentials) => dispatch(changePassword(credentials)),
    changeEmail: (email, id) => dispatch(changeEmail(email, id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantDocument)