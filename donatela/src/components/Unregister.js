import { gql, useMutation } from "@apollo/client";
import { faSadCry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect } from "react";
import { Context } from "../Store";

const UNREGISTER = gql`
  mutation DelAccount($id: String!) {
    deleteUserAccount(userAccountData: { id: $id }) {
      userAccount {
        id
        username
      }
    }
  }
`;

const Unregister = () => {
  const [state, dispatch] = useContext(Context);
  const [DelAccount] = useMutation(UNREGISTER, {
    variables: {
      id: state.auth.userId,
    },
    onCompleted({ deleteUserAccount }) {
      if (deleteUserAccount) {
        dispatch({
          type: "UNREGISTER",
          payload: {},
        });
      }
    },
  });

  useEffect(() => {
    DelAccount();
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
        Sad to see You leave <FontAwesomeIcon icon={faSadCry} />
      </h1>
    </div>
  );
};

export default Unregister;
