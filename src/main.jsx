import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./constants/colors.css";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </ThemeProvider>
  </Provider>,
);
