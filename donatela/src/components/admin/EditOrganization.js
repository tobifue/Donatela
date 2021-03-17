import { faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { Context } from "../../Store";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Loading } from "react-loading-dot";

const GET_ORGA = gql`
  query Organizations($token: String!, $id: ID!) {
    organizations(token: $token, id: $id) {
      edges {
        node {
          name
          employees
          focus
          numberProjects
          address
          business {
            id
          }
        }
      }
    }
  }
`;

const DELETE_ORGA = gql`
  mutation DeleteOrganization($id: String!) {
    deleteOrganization(organizationData: { id: $id }) {
      organization {
        id
      }
    }
  }
`;

const EDIT_ORGA = gql`
  mutation UpdateOrganization(
    $id: String!
    $focus: String
    $name: String
    $numberProjects: Int
    $address: String
    $employees: Int
    $business: String
  ) {
    updateOrganization(
      organizationData: {
        id: $id
        focus: $focus
        name: $name
        numberProjects: $numberProjects
        address: $address
        employees: $employees
        business: $business
      }
    ) {
      organization {
        id
      }
    }
  }
`;

const EditOrganization = () => {
  const [state, dispatch] = useContext(Context);
  const params = useParams();
  const [formState, setFormState] = useState({
    focus: "",
    name: "",
    numberProjects: 0,
    address: "",
    employees: 0,
    business: "",
    noRes: false,
  });

  const { data, loading } = useQuery(GET_ORGA, {
    variables: {
      token: state.auth.token,
      id: params.orgaId,
    },
    onCompleted({ organizations }) {
      if (organizations.edges[0]) {
        setFormState({
          focus: organizations.edges[0].node.focus,
          name: organizations.edges[0].node.name,
          numberProjects: organizations.edges[0].node.numberProjects,
          address: organizations.edges[0].node.address,
          employees: organizations.edges[0].node.employees,
          business: organizations.edges[0].node.business
            ? organizations.edges[0].node.business.id
            : "",
        });
      } else {
        setFormState({
          noRes: true,
        });
      }
    },
  });

  const [UpdateOrganization] = useMutation(EDIT_ORGA, {
    variables: {
      id: params.orgaId,
      focus: formState.focus,
      name: formState.name,
      numberProjects: formState.numberProjects,
      address: formState.address,
      employees: formState.employees,
      business: formState.business,
    },
    onCompleted({ updateOrganization }) {
      if (updateOrganization) {
        window.location.reload(true);
      }
    },
  });

  const [DeleteOrganization] = useMutation(DELETE_ORGA, {
    variables: {
      id: params.orgaId,
    },
    onCompleted({ deleteOrganization }) {
      if (deleteOrganization) {
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
        <h1>Organization Was Deleted!</h1>
      </div>
    );
  }
  return (
    <div className="col-md-6 m-auto">
      <div className="card mt-5">
        <div className="card-header text-white bg-dark">
          <h2 className="text-center">Organization Detail</h2>
        </div>
        <div className="card-body mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              UpdateOrganization();
            }}
          >
            <div className="form-group">
              <label>Focus</label>
              <input
                type="text"
                className="form-control"
                name="focus"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    focus: e.target.value,
                  })
                }
                value={formState.focus}
              />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    name: e.target.value,
                  })
                }
                value={formState.name}
              />
            </div>
            <div className="form-group">
              <label>Number Projects</label>
              <input
                type="number"
                step="1"
                min="0"
                className="form-control"
                name="numberProjects"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    numberProjects: e.target.value,
                  })
                }
                value={formState.numberProjects}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    address: e.target.value,
                  })
                }
                value={formState.address}
              />
            </div>
            <div className="form-group">
              <label>Employees</label>
              <input
                type="number"
                step="1"
                min="0"
                className="form-control"
                name="employees"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    employees: e.target.value,
                  })
                }
                value={formState.employees}
              />
            </div>
            <div className="form-group">
              <label>Business ID</label>
              <input
                type="text"
                className="form-control"
                name="business"
                placeholder="no business assigned"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    business: e.target.value,
                  })
                }
                value={formState.business}
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
                      "Are you sure you want to delete this Organization"
                    )
                  ) {
                    DeleteOrganization();
                  }
                }}
              >
                Delete Organization
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrganization;
