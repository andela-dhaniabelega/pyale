import React from 'react';
import queryString from 'query-string';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import { resetPassword } from '../store/actions/authActions';
import Aux from '../hoc/Aux_';
import Switcher from '../components/Switcher';
import {FormErrors} from "../components/FormErrors";


class PasswordReset extends React.Component {
  state = {
    newPassword: "",
    newPasswordRepeat: "",
    passwordResetComplete: false,
    formErrors: {newPassword: '', newPasswordRepeat: ''},
    newPasswordValid: false,
    newPasswordRepeatValid: false,
    formValid: false,
  };

  validateField = (field, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let newPasswordValid = this.state.newPasswordValid;
    let newPasswordRepeatValid = this.state.newPasswordRepeatValid;

    switch(field) {
      case 'newPassword':
        newPasswordValid = value.length >= 8;
        fieldValidationErrors.newPasswordValid = newPasswordValid ? '' : 'Password too short';
        break;
      case 'newPasswordRepeat':
        newPasswordRepeatValid = value === this.state.newPassword;
        fieldValidationErrors.newPasswordRepeatValid = newPasswordRepeatValid ? '': 'Passwords do not match';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      newPasswordValid: newPasswordValid,
      newPasswordRepeatValid: newPasswordRepeatValid
    }, this.validateForm);
  };

  validateForm = () => {
    this.setState({
      formValid: this.state.newPasswordValid && this.state.newPasswordRepeatValid
    });
  };

  handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    this.setState({
      [id]: value
    }, () => {
      this.validateField(id, value)
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const parsed = queryString.parse(window.location.search);
    const credentials = {password: this.state.newPassword, token: parsed.token};

    this.props.resetPassword(credentials).then(() => {
      this.setState({
        passwordResetComplete: this.props.passwordResetComplete
      });
      if (this.props.passwordResetIncomplete) {
        this.props.history.push('/forgot_password')
      }
    })
  };

  loginAfterPasswordReset = (e) => {
    e.preventDefault();
    this.props.history.push('/login')
  };


  render() {
    const { passwordResetComplete } = this.state;
    return (
      <Aux>

        <div className="account-home-btn d-none d-sm-block">
          <Link to="/" className="text-white forgot-password-logo">PYALE PROPERTIES</Link>
        </div>

        <section className="bg-account-pages height-100vh">
          <div className="display-table">
            <div className="display-table-cell">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-5">
                    <div className="card account-card">
                      <div className="card-body">
                        {
                          !passwordResetComplete ? (
                            <div>
                              <div className="text-center mt-3">
                                <h3 className="font-weight-bold">
                                  <Link
                                    to="home-one"
                                    className="text-dark text-uppercase account-pages-logo"
                                  >
                                    Pyale Properties
                                  </Link>
                                </h3>
                                <p className="text-muted">Password Reset</p>
                                {/*{ authError ? <p className="">Login Failed. Please Try Again</p>: null }*/}
                              </div>
                              <div className="p-3">
                                <FormErrors formErrors={this.state.formErrors} />
                                <form onSubmit={this.handleSubmit}>
                                  <div className="form-group">
                                    <label htmlFor="password">New Password</label>
                                    <input
                                      type="password"
                                      className="form-control"
                                      id="newPassword"
                                      placeholder="Enter New password"
                                      onChange={this.handleChange}
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label htmlFor="password">Repeat New Password</label>
                                    <input
                                      type="password"
                                      className="form-control"
                                      id="newPasswordRepeat"
                                      placeholder="Re-enter new password"
                                      onChange={this.handleChange}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    <button
                                      type="submit"
                                      className="btn btn-custom btn-block"
                                      disabled={!this.state.formValid}
                                    >
                                      Reset Password
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="p-3">
                                <div className="alert alert-success  text-center" role="alert">
                                  Password reset successfully. Click the button below to login with your new password
                                </div>
                              </div>
                              <div className="mt-3">
                                  <button
                                    type="submit"
                                    className="btn btn-custom btn-block"
                                    onClick={this.loginAfterPasswordReset}
                                  >
                                    Login
                                  </button>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Switcher/>

      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    passwordResetComplete: state.authReset.passwordResetComplete,
    passwordResetIncomplete: state.authReset.passwordResetIncomplete
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (credentials) => dispatch(resetPassword(credentials))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordReset));