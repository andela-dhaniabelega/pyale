import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import SocialMedia from '../components/SocialMedia';
import Footer from '../components/Footer';
import FooterLinks from '../components/FooterLinks';
import Aux from '../hoc/Aux_'
import Navbar from "../components/Navbar";
import {connect} from "react-redux";
import {getTenantLettings} from "../redux/actions/tenant";


class MyLetting extends React.Component {
  componentWillMount() {
    this.props.getTenantLettings()
  }

  render() {
    console.log(this.props.lettings);
    const {isAuthenticated, user, lettings} = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login"/>
    }
    return (
      <Aux>
        <Navbar/>
        <section className="section section-lg bg-web-desc">
          <div className="bg-overlay"></div>
        </section>
        <section className="section" id="features">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h1 className="detail-section-title text-center">My Letting</h1>
                <div className="detail-section-title-border margin-t-20"></div>
              </div>
            </div>

            <div className="row non-vertical-content">
              <div className="col-lg-5">
                <div>
                  <div className="card account-card letting-summary-container p-f">
                  <div className="card-body">
                    <h4>Letting Summary</h4>
                    <div className="my-letting-section-title-border margin-t-20"></div>
                    <ul className="letting-summary">
                      <li className="letting-summary-item">
                        {lettings && lettings.map((letting) => {
                          return (
                            <ul className="letting-summary">
                              <li>
                                {
                                  (letting.start_date && letting.end_date) &&
                                  <div>Tenancy: <span>{letting.start_date} to {letting.end_date}</span></div>}
                              </li>
                              <li>
                                {
                                  letting.schedule_type &&
                                  <div>Payment Schedule: <span>{letting.schedule_type}</span></div>
                                }
                              </li>
                              <li>
                                {
                                  letting.amount_paid &&
                                  <div>Amount Paid: <span>NGN {letting.amount_paid}</span></div>
                                }
                              </li>
                              <li>
                                {
                                  letting.amount_outstanding &&
                                  <div>Amount Outstanding: <span>NGN {letting.amount_outstanding}</span></div>
                                }
                              </li>
                            </ul>
                          )
                        })}

                      </li>
                    </ul>
                  </div>
                </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="card account-card letting-summary-container">
                  <div className="card-body">
                    <h4>Bio</h4>
                    <div className="my-letting-section-title-border margin-t-20"></div>
                    <ul className="letting-summary">
                      <li className="letting-summary-item">
                        {user.first_name && <div>First Name: <span >{user.first_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.last_name && <div>Last Name: <span>{user.last_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                         {user.middle_name && <div>Middle Name: <span>{user.middle_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.maiden_name && <div>Maiden Name: <span>{user.maiden_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.nationality && <div>Nationality: <span>{user.nationality}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.gender && <div>Gender: <span>{user.gender}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.telephone && <div>Telephone: <span>{user.telephone}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.id_number && <div>ID Number: <span>{user.id_number}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.mobile_number && <div>Mobile Number: <span>{user.mobile_number}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.whatsapp_number && <div>Whatsapp Number: <span>{user.whatsapp_number}</span></div>}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card account-card letting-summary-container">
                  <div className="card-body">
                    <h4>Previous Address</h4>
                    <div className="my-letting-section-title-border margin-t-20"></div>
                    <ul className="letting-summary">
                      <li className="letting-summary-item">
                        {user.previous_address_house_number &&
                        <div>House Number: <span>{user.previous_address_house_number}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.previous_address_house_name &&
                        <div>House Name: <span>{user.previous_address_house_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.previous_address_street &&
                        <div>Street: <span>{user.previous_address_street}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.previous_address_town &&
                        <div>Town: <span>{user.previous_address_town}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.previous_address_city &&
                        <div>City: <span>{user.previous_address_city}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.previous_address_state &&
                        <div>City: <span>{user.previous_address_state}</span></div>}
                      </li>
                       <li className="letting-summary-item">
                        {user.previous_address_duration_of_stay &&
                        <div>Duration of Stay: <span>{user.previous_address_duration_of_stay}</span></div>}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card account-card letting-summary-container">
                  <div className="card-body">
                    <h4>Employment Details</h4>
                    <div className="my-letting-section-title-border margin-t-20"></div>
                    <ul className="letting-summary">
                      <li className="letting-summary-item">
                        {user.employment_status &&
                        <div>Employment Status: <span>{user.employment_status}</span></div>}
                      </li>
                       <li className="letting-summary-item">
                        {user.job_title &&
                        <div>Job Title: <span>{user.job_title}</span></div>}
                      </li>
                       <li className="letting-summary-item">
                        {user.years_at_current_employment &&
                        <div>Years at current employment: <span>{user.years_at_current_employment}</span></div>}
                      </li>
                       <li className="letting-summary-item">
                        {user.employer_name &&
                        <div>Employer Name: <span>{user.employer_name}</span></div>}
                      </li>
                       <li className="letting-summary-item">
                        {user.employer_contact_person &&
                        <div>Employer Contact Person: <span>{user.employer_contact_person}</span></div>}
                      </li>
                       <li className="letting-summary-item">
                        {user.previous_address_house_number &&
                        <div>House Number: <span>{user.previous_address_house_number}</span></div>}
                      </li>
                       <li className="letting-summary-item">
                        {user.employer_telephone &&
                        <div>Employer Telephone: <span>{user.employer_telephone}</span></div>}
                      </li>
                       <li className="letting-summary-item">
                        {user.employer_mobile &&
                        <div>Employer Mobile: <span>{user.employer_mobile}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.employer_email &&
                        <div>Employer Email: <span>{user.employer_email}</span></div>}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card account-card letting-summary-container">
                  <div className="card-body">
                    <h4>Next of Kin</h4>
                    <div className="my-letting-section-title-border margin-t-20"></div>
                    <ul className="letting-summary">
                      <li className="letting-summary-item">
                        {user.next_of_kin_first_name &&
                        <div>First Name: <span>{user.next_of_kin_first_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_last_name &&
                        <div>Last Name: <span>{user.next_of_kin_last_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_house_number &&
                        <div>House Number: <span>{user.next_of_kin_house_number}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_house_name &&
                        <div>House Name: <span>{user.next_of_kin_house_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_street &&
                        <div>Street: <span>{user.next_of_kin_street}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_town &&
                        <div>Town: <span>{user.next_of_kin_town}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_city &&
                        <div>City: <span>{user.next_of_kin_city}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_state &&
                        <div>State: <span>{user.next_of_kin_state}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_mobile_1 &&
                        <div>Mobile: <span>{user.next_of_kin_mobile_1}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_mobile_2 &&
                        <div>Telephone: <span>{user.next_of_kin_mobile_2}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_email &&
                        <div>Email: <span>{user.next_of_kin_email}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.next_of_kin_relationship_to_tenant &&
                        <div>Relationship to Tenant: <span>{user.next_of_kin_relationship_to_tenant}</span></div>}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card account-card letting-summary-container">
                  <div className="card-body">
                    <h4>Referee</h4>
                    <div className="my-letting-section-title-border margin-t-20"></div>
                    <ul className="letting-summary">
                      <li className="letting-summary-item">
                        {user.referee_name &&
                        <div>Name: <span>{user.referee_name}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.referee_mobile_number_1 &&
                        <div>Mobile: <span>{user.referee_mobile_number_1}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.referee_mobile_number_2 &&
                        <div>Telephone: <span>{user.referee_mobile_number_2}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.referee_email &&
                        <div>Email: <span>{user.referee_email}</span></div>}
                      </li>
                      <li className="letting-summary-item">
                        {user.referee_relationship_to_tenant &&
                        <div>Relationship To Tenant: <span>{user.referee_relationship_to_tenant}</span></div>}
                      </li>
                    </ul>
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

const matchStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    lettings: state.tenant.lettings
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTenantLettings: () => dispatch(getTenantLettings())
  }
};


export default connect(matchStateToProps, mapDispatchToProps)(MyLetting);