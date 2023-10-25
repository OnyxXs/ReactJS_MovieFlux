import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "./config/firebaseConfig";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const history = useNavigate();

  console.log("HomeScreen rendered!");
  const handleClick = () => {
    signOut(auth)
      .then((val) => {
        console.log(val, "val");
        history("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleClick}>SignOut</button>
    </div>
  );
}

export default HomeScreen;