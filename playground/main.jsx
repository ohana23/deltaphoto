import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Deltaphoto } from "../src/index.ts";
import "../src/styles.css";
import "./styles.css";

function App() {
  return (
    <main className="preview">
      <Deltaphoto
        before="/demo/before.png"
        after="/demo/after.png"
        beforeAlt="Apartment living room before renovation"
        afterAlt="Apartment living room after renovation"
        beforeLabel="Before"
        afterLabel="After"
        ariaLabel="Compare the apartment before and after renovation"
      />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
