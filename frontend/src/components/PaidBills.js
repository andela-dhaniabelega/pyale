import React from 'react'
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";


class UnPaidBills extends React.Component {

  getPaidBills = (bills) => {
    return bills.filter((bill) => {
      return bill.payment_status
    })
  };

  render() {
    const {isAuthenticated, bills} = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login"/>
    }
    const paidBills = this.getPaidBills(bills);

    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <caption>Paid Bills</caption>
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
            paidBills.length > 0 ?
              paidBills.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>Service Charge</td>
                    <td>{item.amount_due}</td>
                    <td>{item.payment_cycle}</td>
                    <td>
                      <button>Pay Online</button>
                    </td>
                  </tr>
                )
              }) : paidBills.length === 0 ? <tr className="text-center"><td colSpan="5">No Paid Bills</td></tr> : ""
          }
          </tbody>
        </table>
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