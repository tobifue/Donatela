import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import Header from "./layout/Header";
import Home from "./Home";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import Store from "../Store";
import Donate from "./Donate";
import User from "./User";
import Unregister from "./Unregister";
import LoginAdmin from "./admin/LoginAdmin";
import ManageUsers from "./admin/ManageUsers";
import EditUser from "./admin/EditUser";
import ManageOrganizations from "./admin/ManageOrganizations";
import EditOrganization from "./admin/EditOrganization";
import Organizations from "./Organizations";
import MatchingOrganizations from "./MatchingOrganizations";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

class App extends Component {
  state = {};
  render() {
    return (
      <Store>
        <ApolloProvider client={client}>
          <Router>
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/organizations" exact component={Organizations} />
              <Route
                path="/matching_organizations"
                exact
                component={MatchingOrganizations}
              />
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
              <Route path="/logout" exact component={Logout} />
              <Route path="/donate/:orgaId/:orgaName" component={Donate} />
              <Route path="/user" component={User} />
              <Route path="/unregister" component={Unregister} />
              // Admin views
              <Route path="/loginAdmin" exact component={LoginAdmin} />
              <Route path="/manageUsers" exact component={ManageUsers} />
              <Route path="/userEdit/:userId" component={EditUser} />
              <Route
                path="/manageOrganizations"
                exact
                component={ManageOrganizations}
              />
              <Route
                path="/organizationEdit/:orgaId"
                component={EditOrganization}
              />
            </Switch>
          </Router>
        </ApolloProvider>
      </Store>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
