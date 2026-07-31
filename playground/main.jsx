import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Deltaphoto } from "../src/index.ts";
import "../src/styles.css";
import "./styles.css";

const photoSets = [
  {
    id: "apartment",
    name: "Apartment renovation",
    before: "/demo/before.png",
    after: "/demo/after.png",
    beforeAlt: "Apartment living room before renovation",
    afterAlt: "Apartment living room after renovation",
    beforeLabel: "Before",
    afterLabel: "After",
    ariaLabel: "Compare the apartment before and after renovation",
  },
  {
    id: "miami",
    name: "Miami skyline",
    before: "/demo/miami-night.png",
    after: "/demo/miami-day.png",
    beforeAlt: "Miami skyline at night",
    afterAlt: "Miami skyline during the day",
    beforeLabel: "Night",
    afterLabel: "Day",
    ariaLabel: "Compare the Miami skyline at night and during the day",
  },
];

function App() {
  const [selectedPhotoSet, setSelectedPhotoSet] = useState("apartment");
  const [backgroundColor, setBackgroundColor] = useState("#e6e6e6");
  const [foregroundColor, setForegroundColor] = useState("#373737");
  const [beforePillText, setBeforePillText] = useState("Before");
  const [afterPillText, setAfterPillText] = useState("After");
  const activePhotoSet = photoSets.find(
    (photoSet) => photoSet.id === selectedPhotoSet,
  );

  const handlePhotoSetChange = (photoSetId) => {
    const nextPhotoSet = photoSets.find(
      (photoSet) => photoSet.id === photoSetId,
    );

    if (!nextPhotoSet) return;

    setSelectedPhotoSet(photoSetId);
    setBeforePillText(nextPhotoSet.beforeLabel);
    setAfterPillText(nextPhotoSet.afterLabel);
  };

  return (
    <main className="preview">
      <aside className="preview-controls" aria-label="Preview controls">
        <fieldset className="preview-controls__group">
          <legend>Photo set</legend>
          {photoSets.map((photoSet) => (
            <label className="preview-controls__radio" key={photoSet.id}>
              <input
                type="radio"
                name="photo-set"
                value={photoSet.id}
                checked={selectedPhotoSet === photoSet.id}
                onChange={(event) => handlePhotoSetChange(event.target.value)}
              />
              <span>{photoSet.name}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="preview-controls__group">
          <legend>Pill text</legend>
          <label className="preview-controls__text">
            <span>Before</span>
            <input
              type="text"
              value={beforePillText}
              onChange={(event) => setBeforePillText(event.target.value)}
            />
          </label>
          <label className="preview-controls__text">
            <span>After</span>
            <input
              type="text"
              value={afterPillText}
              onChange={(event) => setAfterPillText(event.target.value)}
            />
          </label>
        </fieldset>

        <div className="preview-controls__group">
          <label className="preview-controls__color">
            <span>Background</span>
            <input
              type="color"
              value={backgroundColor}
              onChange={(event) => setBackgroundColor(event.target.value)}
            />
          </label>
          <label className="preview-controls__color">
            <span>Foreground</span>
            <input
              type="color"
              value={foregroundColor}
              onChange={(event) => setForegroundColor(event.target.value)}
            />
          </label>
        </div>
      </aside>

      {activePhotoSet && (
        <Deltaphoto
          {...activePhotoSet}
          beforeLabel={beforePillText}
          afterLabel={afterPillText}
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
