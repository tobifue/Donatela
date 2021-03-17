import { faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { Context } from "../../Store";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Loading } from "react-loading-dot";

const GET_USER = gql`
  query GetUser($token: String!, $id: ID!) {
    userAccounts(token: $token, id: $id) {
      edges {
        node {
          id
          username
          email
          firstname
          lastname
          preference
          password
        }
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteAccount($id: String!) {
    deleteUserAccount(userAccountData: { id: $id }) {
      userAccount {
        id
        username
      }
    }
  }
`;

const EDIT_USER = gql`
  mutation UpdateAccount(
    $id: String!
    $email: String
    $firstname: String
    $lastname: String
    $preference: String
    $password: String
  ) {
    updateUserAccount(
      userAccountData: {
        id: $id
        email: $email
        firstname: $firstname
        lastname: $lastname
        preference: $preference
        password: $password
      }
    ) {
      userAccount {
        id
        username
      }
    }
  }
`;

const User = () => {
  const [state, dispatch] = useContext(Context);
  const params = useParams();
  const history = useHistory();
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    preference: "",
    password: "",
    noRes: false,
  });

  const { data, loading } = useQuery(GET_USER, {
    variables: {
      token: state.auth.token,
      id: params.userId,
    },
    onCompleted({ userAccounts }) {
      if (userAccounts.edges[0]) {
        setFormState({
          username: userAccounts.edges[0].node.username,
          email: userAccounts.edges[0].node.email,
          firstname: userAccounts.edges[0].node.firstname,
          lastname: userAccounts.edges[0].node.lastname,
          preference: userAccounts.edges[0].node.preference,
          password: userAccounts.edges[0].node.password,
        });
      } else {
        setFormState({
          noRes: true,
        });
      }
    },
  });

  const [UpdateAccount] = useMutation(EDIT_USER, {
    variables: {
      id: params.userId,
      email: formState.email,
      firstname: formState.firstname,
      lastname: formState.lastname,
      preference: formState.preference,
      password: formState.password,
    },
    onCompleted({ updateUserAccount }) {
      if (updateUserAccount) {
        window.location.reload(true);
      }
    },
  });

  const [DeleteAccount] = useMutation(DELETE_USER, {
    variables: {
      id: params.userId,
    },
    onCompleted({ deleteUserAccount }) {
      if (deleteUserAccount) {
        window.location.reload(true);
      }
    },
  });

  useEffect(() => {
    data && console.log(data);
  }, []);

  if (!state.auth.isAdmin) {
    return <Redirect to="/loginAdmin" />;
  }
  if (loading) {
    return <Loading background={"rgb(255,255,255)"} />;
  }
  if (formState.noRes && !loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 40,
          left: 40,
          width: "90%",
          height: "80%",
          color: "white",
        }}
      >
        <h1>User Was Deleted!</h1>
      </div>
    );
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
              UpdateAccount();
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
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    email: e.target.value,
                  })
                }
                value={formState.email}
              />
            </div>
            <div className="form-group">
              <label>Firstname</label>
              <input
                type="text"
                className="form-control"
                name="firstname"
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
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    preference: e.target.value,
                  })
                }
                value={formState.preference}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="text"
                className="form-control"
                name="password"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    password: e.target.value,
                  })
                }
                value={formState.password}
              />
            </div>
            <br />
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this Account"
                    )
                  ) {
                    DeleteAccount();
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
