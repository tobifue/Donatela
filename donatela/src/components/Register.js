import { gql, useMutation } from "@apollo/client";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Context } from "../Store";

const ADD_USER = gql`
  mutation CreateUserAccount(
    $username: String!
    $email: String!
    $firstname: String!
    $lastname: String!
    $preference: String!
    $password: String!
  ) {
    createUserAccount(
      userAccountData: {
        username: $username
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
        password
      }
    }
  }
`;

const LOGIN = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
      userId
      preference
    }
  }
`;

const Register = () => {
  const [state, dispatch] = useContext(Context);
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    preference: "",
    password: "",
  });

  const [loginUser] = useMutation(LOGIN, {
    onCompleted({ login }) {
      if (login) {
        dispatch({
          type: "LOGIN",
          payload: {
            token: login.accessToken,
            refreshToken: login.refreshToken,
            preference: login.preference,
            userId: login.userId,
            username: formState.username,
          },
        });
      }
    },
  });

  const [createUserAccount] = useMutation(ADD_USER, {
    variables: {
      username: formState.username,
      email: formState.email,
      firstname: formState.firstname,
      lastname: formState.lastname,
      preference: formState.preference,
      password: formState.password,
    },
    onCompleted({ createUserAccount }) {
      if (createUserAccount) {
        loginUser({
          variables: {
            username: createUserAccount.userAccount.username,
            password: createUserAccount.userAccount.password,
          },
        });
      }
    },
  });

  if (state.auth.token) {
    return <Redirect to="/" />;
  }
  return (
    <div className="col-md-6 m-auto">
      <div className="card mt-5">
        <div className="card-header text-white bg-dark">
          <h2 className="text-center">
            Register
            <span style={{ paddingLeft: "10px" }}>
              <FontAwesomeIcon icon={faUserPlus} />
            </span>
          </h2>
        </div>
        <div className="card-body mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createUserAccount();
            }}
          >
            <div className="form-group">
              <label>Username</label>
              <input
                required
                type="text"
                className="form-control"
                name="username"
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
                required
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
                type="firstname"
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
                type="lastname"
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
                required
                type="preference"
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
                required
                type="password"
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
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
