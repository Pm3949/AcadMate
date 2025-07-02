import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/slices/store.js";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatbotWidget from "./components/chatBot.jsx";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {" "}
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <ChatbotWidget/>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
