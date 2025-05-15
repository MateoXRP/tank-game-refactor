import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Cookies from "js-cookie";

function DelayedApp() {
  const [ready, setReady] = useState(false);
  const [initialScreen, setInitialScreen] = useState("login");
  const [initialName, setInitialName] = useState("");

  useEffect(() => {
    const name = Cookies.get("tankPlayer");
    const screen = Cookies.get("tankScreen") || "shop";

    if (name) {
      setInitialName(name);
      setInitialScreen(screen);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return <App initialScreen={initialScreen} initialName={initialName} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DelayedApp />
  </React.StrictMode>
);

