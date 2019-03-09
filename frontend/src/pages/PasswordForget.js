import React from 'react';
import Aux from '../hoc/Aux_';
import {Link, withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {createPasswordResetToken} from "../store/actions/authActions";
import {FormErrors} from "../components/FormErrors";

class PasswordForget extends React.Component {
  state = {
    email: "",
    passwordResetLinkSent: false,
    isSendingEmail: false,
    formErrors: {email: '', passwordResetError: ''},
    emailValid: false,
  };

  handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    this.setState({
      [id]: value
    }, () => {
      this.validateEmail(id, value)
    })
  };

  validateEmail = (id, email) => {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let re = /\S+@\S+\.\S+/;

    emailValid = re.test(email);
    fieldValidationErrors.email = emailValid ? '' : 'Invalid Email';

    this.setState({
      formErrors: fieldValidationErrors,
      emailValid: emailValid,
    }, this.validateForm);
  };

  validateForm = () => {
    this.setState({
      formValid: this.state.emailValid
    });
  };

  handlePasswordReset = (e) => {
    e.preventDefault();
    this.setState({isSendingEmail: true});
    this.props.createPasswordResetToken(this.state.email).then(() => {
      this.setState(prevState => ({
        passwordResetLinkSent: this.props.passwordResetLinkSent,
        isSendingEmail: false,
        formErrors: {
          ...prevState.formErrors,
          passwordResetError: this.props.passwordResetError
        }
      }));
    })
  };

  loginAfterPasswordReset = (e) => {
    e.preventDefault();
    this.props.history.push('/login')
  };

  render() {
    if (this.props.isAuthenticated) {
      this.props.history.push('/')
    }
    const {passwordResetLinkSent} = this.state;
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
                          !passwordResetLinkSent ? (
                            <div>
                              <div className="text-center mt-3">
                                <h3 className="font-weight-bold">
                                  <Link
                                    to="home-one"
                                    className="text-dark text-uppercase account-pages-logo"
                                  >Tenant Portal</Link>
                                </h3>
                                <p className="text-muted">Reset Password</p>
                                <FormErrors formErrors={this.state.formErrors} />
                              </div>
                              <div className="p-3">
                                <div className="alert alert-warning  text-center" role="alert">
                                  Enter your email address and we'll send you an email with instructions to reset your
                                  password.
                                </div>
                                <form>
                                  <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="email"
                                      placeholder="Enter Email"
                                      onChange={this.handleChange}
                                    />
                                  </div>

                                  <div className="mt-3">
                                    <button
                                      type="submit"
                                      className="btn btn-custom btn-block"
                                      onClick={this.handlePasswordReset}
                                    >
                                      {this.state.isSendingEmail ? 'Loading...' : 'Reset Your Password'}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="p-3">
                                <div className="alert alert-success  text-center" role="alert">
                                  Please check for your email for instructions on how to reset your password.
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
    passwordResetLinkSent: state.authReset.passwordResetLinkSent,
    passwordResetError: state.authReset.passwordResetError,
    isAuthenticated: state.auth.isAuthenticated
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPasswordResetToken: (email) => dispatch(createPasswordResetToken(email))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordForget));