import React from "react";
import styled from "styled-components";

import firebase from "../../config/firebase";

const SignOutButton = () => {
  const signOut = async () => {
    try {
      if (firebase) {
        await firebase.auth().signOut();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return <Button onClick={() => signOut()}>Sign out</Button>;
};

export default SignOutButton;

const Button = styled.button`
  background-color: #00000020;
  padding: 10px 0;
  width: 160px;
  border: none;
  border-radius: 30px;
  color: #00000060;
  font-weight: bold;
  font-family: Segoe UI, sans-serif;
  cursor: pointer;

  :focus {
    outline: none;
  }
`;
