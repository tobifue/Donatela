import { useQuery, gql } from "@apollo/client";
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../Store";
import { Loading } from "react-loading-dot";

const GET_ORGS = gql`
  query Organizations($token: String, $focus: String) {
    organizations(token: $token, focus: $focus) {
      edges {
        node {
          id
          name
          employees
          focus
        }
      }
    }
  }
`;

const MatchingOrganizations = () => {
  const [state, dispatch] = useContext(Context);
  const { data, loading } = useQuery(GET_ORGS, {
    variables: {
      token: state.auth.token,
      focus: state.auth.preference,
    },
  });

  if (!state.auth.token) {
    return <Redirect to="login" />;
  }
  if (!state.auth.preference) {
    return <Redirect to="organizations" />;
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
                  <th scope="col">Name</th>
                  <th scope="col">Employees</th>
                  <th scope="col">Focus</th>
                  <th scope="col">Donate</th>
                </tr>
              </thead>
              <tbody>
                {data && (
                  <>
                    {data.organizations.edges.map((node) => (
                      <tr key={node.node.id}>
                        <td>{node.node.id}</td>
                        <td>{node.node.name}</td>
                        <td>{node.node.employees}</td>
                        <td>{node.node.focus}</td>
                        <td>
                          <a
                            href={`/#/donate/${node.node.id}/${encodeURI(
                              node.node.name
                            )}`}
                            className="btn btn-success"
                          >
                            donate
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

export default MatchingOrganizations;
