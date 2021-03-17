import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../Store";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faHeart } from "@fortawesome/free-solid-svg-icons";
import Particles from "react-tsparticles";

const Home = () => {
  const [state, dispatch] = useContext(Context);
  if (state.auth.token) {
    return (
      <div>
        <Particles
          id="tsparticles"
          options={{
            background: {
              color: {
                value: "#c41025",
              },
            },
            fpsLimit: 60,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                bubble: {
                  distance: 400,
                  duration: 2,
                  opacity: 0.8,
                  size: 40,
                },
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 6,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  value_area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 5,
              },
            },
            detectRetina: true,
          }}
        />
        {state.auth.isAdmin === "true" ? (
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
            <h1>
              You Are Logged in as Admin. Ready to maintain the Page?{" "}
              <FontAwesomeIcon icon={faCog} />
            </h1>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 40,
              left: 40,
              width: "100%",
              height: "80%",
              color: "white",
            }}
          >
            <h1>
              Find your ideal organizations {state.auth.username}!{" "}
              <FontAwesomeIcon icon={faHeart} />
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 40,
                left: 40,
                width: "90%",
                height: "110%",
                color: "white",
              }}
            >
              <Link
                to="/matching_organizations"
                style={{ textDecoration: "none", color: "white" }}
                className="nav-link"
              >
                <h3> Match now </h3>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
};

export default Home;
