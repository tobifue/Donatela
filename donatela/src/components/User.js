import { faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Context } from "../Store";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "react-loading-dot";

const GET_USER = gql`
  query GetUser($token: String!, $id: ID!) {
    userAccounts(token: $token, id: $id) {
      edges {
        node {
          id
          username
          firstname
          lastname
          preference
          password
        }
      }
    }
  }
`;

const User = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();
  const [formState, setFormState] = useState({
    username: "",
    firstname: "",
    lastname: "",
    preference: "",
  });

  const { data, loading } = useQuery(GET_USER, {
    variables: {
      token: state.auth.token,
      id: state.auth.userId,
    },
    onCompleted({ userAccounts }) {
      if (userAccounts) {
        setFormState({
          username: userAccounts.edges[0].node.username,
          firstname: userAccounts.edges[0].node.firstname,
          lastname: userAccounts.edges[0].node.lastname,
          preference: userAccounts.edges[0].node.preference,
        });
      }
    },
  });

  useEffect(() => {
    data && console.log(data);
  }, []);

  if (!state.auth.token) {
    return <Redirect to="/login" />;
  }
  if (loading) {
    return <Loading background={"rgb(255,255,255)"} />;
  }
  return (
    <div className="col-md-6 m-auto">
      <div className="card mt-5">
        <div className="card-header text-white bg-dark">
          <h2 className="text-center">
            User Settings
            <span style={{ paddingLeft: "10px" }}>
              <FontAwesomeIcon icon={faUserCog} />
            </span>
          </h2>
        </div>
        <div className="card-body mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                disabled
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    username: e.target.value,
                  })
                }
                value={formState.username}
              />
            </div>
            <div className="form-group">
              <label>Firstname</label>
              <input
                type="text"
                className="form-control"
                name="firstname"
                disabled
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    firstname: e.target.value,
                  })
                }
                value={formState.firstname}
              />
            </div>
            <div className="form-group">
              <label>Lastname</label>
              <input
                type="text"
                className="form-control"
                name="lastname"
                disabled
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    lastname: e.target.value,
                  })
                }
                value={formState.lastname}
              />
            </div>
            <div className="form-group">
              <label>Preference</label>
              <input
                type="text"
                className="form-control"
                name="preference"
                disabled
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    preference: e.target.value,
                  })
                }
                value={formState.preference}
              />
            </div>
            <br />
            <div className="d-flex justify-content-between">
              <button disabled type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your Account"
                    )
                  ) {
                    history.push({
                      pathname: "/unregister",
                    });
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default User;
