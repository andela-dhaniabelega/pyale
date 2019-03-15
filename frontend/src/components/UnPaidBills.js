import React from 'react'
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import PaystackButton from 'react-paystack';

const $ = window.$;
class UnPaidBills extends React.Component {

  getUnPaidBills = (bills) => {
    return bills.filter((bill) => {
      return !bill.payment_status
    })
  };

  callBack = () => {
    $('#myModal').hide();
    $('.modal-backdrop').hide();
  };

  close = () => {
    console.log('closed')
  };

  getReference = () => {

  };

  render() {
    const {isAuthenticated, bills} = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login"/>
    }
    const unpaidBills = this.getUnPaidBills(bills);

    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <caption>Unpaid Bills</caption>
          <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Bill</th>
            <th scope="col">Amount</th>
            <th scope="col">Duration</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          {
            unpaidBills.length > 0 ?
              unpaidBills.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>Service Charge</td>
                    <td>{item.amount}</td>
                    <td>{item.billing_cycle}</td>
                    <td>
                      <button
                        type="button"
                        data-toggle="modal"
                        data-target="#myModal"
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                )
              }) : unpaidBills.length === 0 ? <tr className="text-center">
                <td colSpan="5">No Unpaid Bills</td>
              </tr> : ""
          }
          </tbody>
        </table>
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <PaystackButton
                text="Make Payment"
                class="payButton"
                callback={this.callBack}
                close={this.close}
                disabled={true}
                embed={true}
                reference={this.getReference}
                email="shani4ril@yahoo.coom"
                amount="10000"
                paystackkey="pk_test_b3020aa5212ce41356e048371249d4dc75b21e77"
                tag="button"
              />
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  }
};

export default withRouter(connect(mapStateToProps)(UnPaidBills));