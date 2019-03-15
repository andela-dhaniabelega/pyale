import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import {initialChangePassword, logout} from '../redux/actions/authActions';
import Aux from '../hoc/Aux_';
import {FormErrors} from "../components/FormErrors";


class PasswordReset extends React.Component {
  state = {
    newPassword: "",
    newPasswordRepeat: "",
    currentPassword: "",
    initialPasswordChangeComplete: false,
    formErrors: {newPassword: '', newPasswordRepeat: '', initialPasswordChangeError: ''},
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

  handleChangePassword = (e) => {
    e.preventDefault();
    this.props.initialChangePassword(this.state).then(() => {
      if (this.props.initialPasswordChangeComplete) {
        this.setState({
          currentPassword: "",
          newPassword: "",
          newPasswordRepeat: "",
        });
        this.props.logout()
      } else {
        this.setState(prevState => ({
          formErrors: {
            ...prevState.formErrors,
            initialPasswordChangeError: this.props.initialPasswordChangeError
          }
        }))
      }
    })
  };

  loginAfterPasswordReset = (e) => {
    e.preventDefault();
    this.props.history.push('/login')
  };


  render() {
    const { initialPasswordChangeComplete } = this.props;
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
                          !initialPasswordChangeComplete ? (
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
                                <p className="text-muted">Change Password</p>
                              </div>
                              <div className="p-3">
                                <FormErrors formErrors={this.state.formErrors} />
                                <form onSubmit={this.handleChangePassword}>
                                  <div className="form-group">
                                    <label htmlFor="password">Current Password</label>
                                    <input
                                      type="password"
                                      className="form-control"
                                      id="currentPassword"
                                      placeholder="Enter current password"
                                      onChange={this.handleChange}
                                    />
                                  </div>

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
                                  Password changed successfully. Click the button below to login with your new password
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
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    initialPasswordChangeComplete: state.authReset.initialPasswordChangeComplete,
    initialPasswordChangeError: state.authReset.initialPasswordChangeError
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    initialChangePassword: (credentials) => dispatch(initialChangePassword(credentials)),
    logout: () => dispatch(logout())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordReset));