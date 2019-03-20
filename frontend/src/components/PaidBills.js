import React from 'react'
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";


class UnPaidBills extends React.Component {
  state = {
    paidBills: []
  };

  componentWillMount() {
    this.props.getTenantBills().then(() => {
      if (this.props.bills) {
        const paidBills = this.props.bills.filter((bill) => {
          return bill.payment_status
        });
        this.setState({paidBills})
      }
    });
  }

  render() {
    const {isAuthenticated} = this.props;
    const {paidBills} = this.state;
    if (!isAuthenticated) {
      return <Redirect to="/login"/>
    }


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
            <th scope="col">Payment Date</th>
          </tr>
          </thead>
          <tbody>
          {
            paidBills.length > 0 ?
              paidBills.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.amount_currency + item.amount}</td>
                    <td>{item.billing_cycle}</td>
                    <td>{item.date_paid}</td>
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
    bills: state.tenant.bills
  }
};

export default withRouter(connect(mapStateToProps)(UnPaidBills));