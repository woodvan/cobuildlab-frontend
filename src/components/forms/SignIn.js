import React, { useState } from "react";
import styled from "styled-components";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import firebase from "../../config/firebase";
// import firebase from "firebase/app";
import "firebase/auth";
import useInput from "../useInput";

const SignInForm = () => {
  const email = useInput("");
  const password = useInput("");
  const [error, setError] = useState("");

  const signIn = (event) => {
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .catch((e) => setError(e.message));
  };

  return (
    <>
      <Title>Sign in</Title>
      <FormWrapper onSubmit={signIn}>
        <Text>Email</Text>
        <Input placeholder="Email" {...email} />
        <Text>Password</Text>
        <Input
          style={{ marginBottom: "20px" }}
          placeholder="Password"
          type="password"
          {...password}
        />
        {error && (
          <Alert
            onClose={() => setError(null)}
            sx={{ width: "400px" }}
            variant="outlined"
            severity="warning"
          >
            {error}
          </Alert>
        )}
        <Button variant="contained" type="submit">
          Sign In
        </Button>
      </FormWrapper>
      <Text style={{ margin: "40px auto 10px", textAlign: "center" }}>
        Don't have an account?
      </Text>
      <Link href="/register" underline="none">
        <Button sx={{ height: 28, fontSize: 12 }}>Sign up</Button>
      </Link>
    </>
  );
};

export default SignInForm;

const FormWrapper = styled.form`
  display: grid;
  justify-content: center;
  gap: 10px;
`;

const Title = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 40px;
  line-height: 48px;
  color: #000;
  text-align: center;
`;

const Text = styled.p`
  font-size: 16px;
  padding: 0 10px;
  margin: 0;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 10px 20px;
  background-blend-mode: overlay;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 20px 40px rgba(31, 47, 71, 0.25),
    0px 1px 5px rgba(0, 0, 0, 0.1), inset 0 0 0 0.5px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(250, 250, 250, 0.4);
  margin-bottom: 20px;
  width: 400px;
  :focus {
    outline: none;
  }
`;
