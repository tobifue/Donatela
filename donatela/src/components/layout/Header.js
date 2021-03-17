import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Store";
import logo from "../../logo.jpeg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export class Header extends Component {
  static contextType = Context;

  render() {
    const [state, dispatch] = this.context;

    const adminLinks = (
      <Fragment>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <span className="navbar-text mr-3" style={{ paddingRight: "30px" }}>
            <strong>Welcome {state.auth.username}!</strong>
          </span>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/manageUsers" className="nav-link">
              Manage Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/manageOrganizations" className="nav-link">
              Manage Organizations
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav navbar-right">
          <li className="nav-item">
            <Link to="/logout" className="nav-link">
              Logout
            </Link>
          </li>
        </ul>
      </Fragment>
    );

    const authLinks = (
      <Fragment>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <span className="navbar-text mr-3" style={{ paddingRight: "30px" }}>
            <strong>Welcome {state.auth.username}!</strong>
          </span>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/organizations" className="nav-link">
              Organizations
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav navbar-right">
          <li className="nav-item" style={{ paddingRight: "30px" }}>
            <Link to="/user" className="nav-link" title="User Settings">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/logout" className="nav-link">
              Logout
            </Link>
          </li>
        </ul>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
        <ul className="navbar-nav navbar-right">
          <li className="nav-item">
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
        </ul>
      </Fragment>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a className="navbar-brand" href="#">
              <img
                src={logo}
                alt="Logo"
                className="image-respnsive"
                style={{ width: "30px", height: "auto", paddingRight: "5px" }}
              />
              Donatela
            </a>
            {state.auth.isAdmin === "true"
              ? adminLinks
              : state.auth.token
              ? authLinks
              : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
