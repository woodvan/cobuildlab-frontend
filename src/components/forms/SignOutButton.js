import React from "react";
import Button from "@material-ui/core/Button";
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

  return (
    <Button
      type="button"
      variant="outlined"
      color="primary"
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  );
};

export default SignOutButton;
