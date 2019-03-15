import React from 'react';
import { Link } from 'react-router-dom';

class SocialMedia extends React.Component {
  render() {
  	return (
        <section className="cta bg-light" id="contact">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <ul className="list-inline social margin-t-20">
                            <li className="list-inline-item">
                              <Link to="JavaScript:Void(0);" className="social-icon">
                                <i className="mdi mdi-facebook"></i>
                              </Link>
                            </li>
                            <li className="list-inline-item">
                              <Link to="JavaScript:Void(0);" className="social-icon">
                                <i className="mdi mdi-twitter"></i>
                              </Link>
                            </li>
                            <li className="list-inline-item">
                              <Link to="JavaScript:Void(0);" className="social-icon">
                                <i className="mdi mdi-instagram"></i>
                              </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 margin-t-30">
                        <p className="margin-b-0 contact-title">
                          <i className="pe-7s-call"></i> &nbsp;+234 803 300 8341
                        </p>
                    </div>
                    <div className="col-lg-5 margin-t-30 text-right">
                        <p className="contact-title">
                          <i className="pe-7s-mail-open"></i>&nbsp; info@pyaleproperties.com
                        </p>
                    </div>
                </div>
            </div>
        </section>
  	);
  }
}
export default SocialMedia;