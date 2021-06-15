import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/**
  <!-- The core Firebase JS SDK is always required and must be listed first -->
  <script src="/__/firebase/8.6.3/firebase-app.js"></script>

  <!-- TODO: Add SDKs for Firebase products that you want to use
      https://firebase.google.com/docs/web/setup#available-libraries -->
  <script src="/__/firebase/8.6.3/firebase-analytics.js"></script>

  <!-- Initialize Firebase -->
  <script src="/__/firebase/init.js"></script>

  // ====================================

  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

  firebase login

  firebase init


  firebase deploy
 */
