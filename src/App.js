import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  // your config
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PRODUCTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Just For Us</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const [signInMode, setSignInMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const pattern = new RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

  const signInWithEmailAndPassword = async (e) => {
    e.preventDefault();
    if (
      !email ||
      !pattern.test(email) ||
      password === "" ||
      password.length < 6
    ) {
      console.log(!email);
      console.log(!pattern.test(email));
      console.log(password === "");
      console.log(password.length < 6);

      setError("Please enter a valid email and password!");
      return;
    }

    signInMode === "signin"
      ? firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => this.props.navigation.navigate("Profile"))
          .catch((error) => {
            console.log(error);
            setError(error.message);
          })
      : firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => this.props.navigation.navigate("Profile"))
          .catch((error) => {
            console.log(error);
            setError(error.message);
          });
  };
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <div className="container">
        <div className="radio">
          <label>
            <input
              className="radioBtn"
              type="radio"
              radioGroup="signInMode"
              value={"signin"}
              checked={signInMode === "signin"}
              onChange={(e) => setSignInMode(e.target.value)}
            />
            Login
          </label>
          <label>
            <input
              className="radioBtn"
              type="radio"
              radioGroup="signInMode"
              value={"signup"}
              checked={signInMode === "signup"}
              onChange={(e) => setSignInMode(e.target.value)}
            />
            SignUp
          </label>
        </div>
        <input
          className="inputBox"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoCapitalize="none"
        />
        <input
          className="inputBox"
          defaultValue={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <p className="errorText">{error}</p>
        <br></br>

        <button className="sign-in" onClick={signInWithEmailAndPassword}>
          {signInMode === "signin" ? "Sign in" : "Sign up"} with Email
        </button>
        <br></br>

        <button className="sign-in" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        <p className="welcome-text">
          Sign-in with any google account. It's not logged anywhere.
        </p>
      </div>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  var Filter = require('bad-words'),
  filter = new Filter();

  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limitToLast(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    let text = filter.clean(formValue);
    await messagesRef.add({
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          send
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL ||
            "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
          }
        />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
