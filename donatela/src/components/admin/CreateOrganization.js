import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const CREATE_ORGA = gql`
  mutation CreateOrganization(
    $focus: String
    $name: String
    $numberProjects: Int
    $address: String
    $employees: Int
    $business: String
  ) {
    createOrganization(
      organizationData: {
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

const CreateOrganization = () => {
  const [formState, setFormState] = useState({
    focus: "",
    name: "",
    numberProjects: 0,
    address: "",
    employees: 0,
    business: "",
  });

  const [CreateOrganization] = useMutation(CREATE_ORGA, {
    variables: {
      focus: formState.focus,
      name: formState.name,
      numberProjects: formState.numberProjects,
      address: formState.address,
      employees: formState.employees,
      business: formState.business,
    },
    onCompleted({ createOrganization }) {
      if (createOrganization) {
        window.location.reload(true);
      }
    },
  });

  return (
    <div className="col-md-6 m-auto">
      <div className="card mt-5">
        <div className="card-header text-white bg-dark">
          <h2 className="text-center">Organization Erstellen</h2>
        </div>
        <div className="card-body mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              CreateOrganization();
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
