import React, { useContext, useState } from "react";
import { Context } from "../Store";
import { Redirect, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDonate } from "@fortawesome/free-solid-svg-icons";

const DONATE = gql`
  mutation Donate(
    $currency: String!
    $amount: String!
    $payment_method: String
    $donor: String!
    $organization: String!
    $receipt: String!
  ) {
    createDonation(
      donationData: {
        currency: $currency
        amount: $amount
        paymentMethod: $payment_method
        donor: $donor
        organization: $organization
        receipt: $receipt
      }
    ) {
      donation {
        id
      }
    }
  }
`;

const ADD_RECEIPT = gql`
  mutation AddReceipt(
    $amount: String!
    $recipient: String!
    $sender: String!
    $currency: String!
  ) {
    createReceipt(
      receiptData: {
        amount: $amount
        recipient: $recipient
        sender: $sender
        currency: $currency
      }
    ) {
      receipt {
        id
      }
    }
  }
`;

const Donate = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();
  const params = useParams();

  const [formState, setFormState] = useState({
    currency: "",
    amount: "",
    payment_method: "",
    receipt: "",
  });

  const [makeDonation] = useMutation(DONATE, {
    onCompleted({ createDonation }) {
      if (createDonation) {
        history.push({
          pathname: "/organizations",
        });
      }
    },
  });

  const [addReceipt] = useMutation(ADD_RECEIPT, {
    variables: {
      amount: formState.amount,
      recipient: params.orgaName,
      sender: state.auth.username,
      currency: formState.currency,
    },
    onCompleted({ createReceipt }) {
      if (createReceipt) {
        makeDonation({
          variables: {
            currency: formState.currency,
            amount: formState.amount,
            payment_method: formState.payment_method,
            donor: state.auth.userId,
            organization: params.orgaId,
            receipt: createReceipt.receipt.id,
          },
        });
      }
    },
  });

  if (!state.auth.token) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="col-md-6 m-auto">
      <div className="card mt-5">
        <div className="card-header text-white bg-dark">
          <h2 className="text-center">
            Your Donation
            <span style={{ paddingLeft: "10px" }}>
              <FontAwesomeIcon icon={faDonate} />
            </span>
          </h2>
        </div>
        <div className="card-body mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addReceipt();
            }}
          >
            <div className="form-group">
              <label>Currency</label>
              <select
                className="form-control"
                name="currency"
                required
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    currency: e.target.value,
                  })
                }
              >
                <option disabled selected value></option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="CHF">CHF</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step=".01"
                min="0"
                className="form-control"
                name="amount"
                required
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    amount: e.target.value,
                  })
                }
                value={formState.amount}
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                className="form-control"
                name="payment_method"
                required
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    payment_method: e.target.value,
                  })
                }
              >
                <option disabled selected value></option>
                <option value="PayPal">PayPal</option>
                <option value="Credit">Credit</option>
                <option value="Transfer">Transfer</option>
                <option value="Bitcoin">Bitcoin</option>
              </select>
            </div>
            <br />
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Donate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
