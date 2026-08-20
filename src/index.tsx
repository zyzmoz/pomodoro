import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The root element was not found.");
}

createRoot(rootElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(new URL("./public/sw.ts", import.meta.url))
    .then((registration) => {
      console.log("Service worker registered.", { registration });
    })
    .catch((error: unknown) => {
      console.error({ error });
    });
}
