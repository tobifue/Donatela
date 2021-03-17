import { useQuery, gql } from "@apollo/client";
import React, { useContext } from "react";
import { Redirect, Link } from "react-router-dom";
import { Context } from "../../Store";
import { Loading } from "react-loading-dot";
import CreateOrganization from "./CreateOrganization";

const GET_ORGS = gql`
  query Organizations($token: String) {
    organizations(token: $token) {
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

const ManageOrganizations = () => {
  const [state, dispatch] = useContext(Context);
  const { data, loading } = useQuery(GET_ORGS, {
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-6" style={{width: "60%"}}>
            <CreateOrganization />
          </div>
          <div className="col-8">
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
                      <th scope="col">Edit</th>
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
                                href={`/#/organizationEdit/${node.node.id}`}
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
          <div className="col-1"></div>
        </div>
      </div>
    </>
  );
};

export default ManageOrganizations;
