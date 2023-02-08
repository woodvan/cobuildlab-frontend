import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import styled from "styled-components";
import firebase from "../src/config/firebase";
import "firebase/auth";

import SignUpForm from "./components/forms/SignUp";
import SignInForm from "./components/forms/SignIn";
import Dashboard from "./views/Dashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUserId(authUser.uid);
        setCurrentUser(authUser.email);
        setLoading(false);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
  }, []);

  return (
    !loading && (
      <Wrapper>
        <Routes>
          <Route
            path="//*"
            element={
              currentUser ? (
                <Dashboard userId={userId} />
              ) : (
                <Navigate to="/register" />
              )
            }
          />
          <Route
            path="*"
            element={
              <main>
                <p>Not found.</p>
              </main>
            }
          />
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/" /> : <SignUpForm />}
          />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <SignInForm />}
          />
        </Routes>
      </Wrapper>
    )
  );
}

const Wrapper = styled.div`
  padding-top: 150px;
  margin: 0 auto;
  display: grid;
  justify-items: center;
  padding-bottom: 100px;
`;
