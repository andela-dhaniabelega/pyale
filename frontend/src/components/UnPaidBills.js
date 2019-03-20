import React from 'react'
import moment from 'moment'
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import PaystackButton from 'react-paystack';
import {generateRandomString} from '../helpers'
import {updateBillPaymentStatus} from "../redux/actions/tenant";

const $ = window.$;

class UnPaidBills extends React.Component {
  state = {
    referenceCode: "",
    billID: null,
    paymentDate: "",
    unpaidBills: []
  };

  componentWillMount() {
    this.props.getTenantBills().then(() => {
      if (this.props.bills) {
        const unpaidBills = this.props.bills.filter((bill) => {
          return !bill.payment_status
        });
        this.setState({unpaidBills})
      }
    });
  }

  handlePay = (e) => {
    const paymentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    const {param} = e.target.dataset;
    const referenceCode = generateRandomString(8, '#aA');
    this.setState({referenceCode, paymentDate, billID: param});
  };

  callBack = () => {
    $('#myModal').hide();
    $('.modal-backdrop').hide();

    if (this.state.billID) {
      this.props.updateBillPaymentStatus(this.state.billID, this.state.paymentDate).then(() => {
        if (this.props.billUpdated) {
          this.props.getTenantBills().then(() => {
            if (this.props.bills) {
              const unpaidBills = this.props.bills.filter((bill) => {
                return !bill.payment_status
              });
              this.setState({unpaidBills})
            }
          });
        }
      })
    }
  };

  render() {
    const {isAuthenticated} = this.props;
    const {unpaidBills} = this.state;
    if (!isAuthenticated) {
      return <Redirect to="/login"/>
    }
    // this.getUnPaidBills();
    console.log(this.state.unpaidBills);

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
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.amount_currency + item.amount}</td>
                    <td>{item.billing_cycle}</td>
                    <td>
                      <button
                        type="button"
                        data-toggle="modal"
                        data-target="#myModal"
                        onClick={this.handlePay}
                        data-param={item.id}
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
                reference={this.state.referenceCode}
                email="shani4ril@yahoo.coom"
                amount={10000}
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
    billUpdated: state.tenantReset.billUpdated,
    bills: state.tenant.bills
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBillPaymentStatus: (id, date) => dispatch(updateBillPaymentStatus(id, date))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UnPaidBills));