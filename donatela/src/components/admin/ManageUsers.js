import { useQuery, gql } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../../Store";
import { Loading } from "react-loading-dot";

const GET_USERS = gql`
  query GetUsers($token: String) {
    userAccounts(token: $token) {
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

const ManageUsers = () => {
  const [state, dispatch] = useContext(Context);
  const { data, loading, refetch } = useQuery(GET_USERS, {
    variables: {
      token: state.auth.token,
    },
  });

  if (!state.auth.isAdmin) {
    return <Redirect to="/loginAdmin" />;
  }
  if (loading) {
    return <Loading background={"rgb(255,255,255)"} />;
  }
  return (
    <>
      <div className="container">
        <div className="card mt-5">
          <div className="card-header text-white bg-dark mb-3">Table</div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Username</th>
                  <th scope="col">Firstname</th>
                  <th scope="col">Lastname</th>
                  <th scope="col">Edit</th>
                </tr>
              </thead>
              <tbody>
                {data && (
                  <>
                    {data.userAccounts.edges.map((node) => (
                      <tr key={node.node.id}>
                        <td>{node.node.id}</td>
                        <td>{node.node.username}</td>
                        <td>{node.node.firstname}</td>
                        <td>{node.node.lastname}</td>
                        <td>
                          <a
                            href={`/#/userEdit/${node.node.id}`}
                            className="btn btn-primary"
                          >
                            edit
                          </a>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
