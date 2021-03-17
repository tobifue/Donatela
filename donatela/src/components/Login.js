import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link, Redirect } from "react-router-dom";
import { Context } from "../Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const LOGIN = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
      userId
      preference
      isAdmin
    }
  }
`;

const Login = () => {
  const [state, dispatch] = useContext(Context);

  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });

  const [loginUser, { loading: loginLoading, error: loginError }] = useMutation(
    LOGIN,
    {
      variables: {
        username: formState.username,
        password: formState.password,
      },
      onCompleted({ login }) {
        if (login) {
          dispatch({
            type: "LOGIN",
            payload: {
              token: login.accessToken,
              refreshToken: login.refreshToken,
              userId: login.userId,
              preference: login.preference,
              isAdmin: login.isAdmin,
              username: formState.username,
            },
          });
        }
      },
    }
  );

  if (state.auth.token) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div className="col-md-6 m-auto">
        {loginError && (
          <div class="mt-1 alert alert-danger" role="alert">
            Wrong Credentials! Please try again.
          </div>
        )}
        <div className="card mt-5">
          <div className="card-header text-white bg-dark">
            <h2 className="text-center">
              Login
              <span style={{ paddingLeft: "10px" }}>
                <FontAwesomeIcon icon={faSignInAlt} />
              </span>
            </h2>
          </div>
          <div className="card-body mt-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginUser();
              }}
            >
              <div className="form-group">
                <label>Username</label>
                <input
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
                <label>Password</label>
                <input
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
                  Login
                </button>
              </div>
              <p>
                Have no account yet? Register here{" "}
                <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
