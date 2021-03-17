import { faHandSpock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect } from "react";
import { Context } from "../Store";

const Logout = () => {
  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    dispatch({ type: "LOGOUT", payload: {} });
  }, []);

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
      <h1>
        Logout successful <FontAwesomeIcon icon={faHandSpock} />
      </h1>
    </div>
  );
};

export default Logout;
