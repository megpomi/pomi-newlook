import { useState } from "react";
import "@/App.css";
import { BrowserRouter } from "react-router-dom";
import Start from "@/pages/Start";
import IntroStepOriginal from "@/pomi/IntroStepOriginal";
import { resetPreview } from "@/api/base44Client";

const BeforeNext = ({ onBack }) => (
  <div data-testid="preview-next-step" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-slate-600">
    <p>The "Before" view only covers the welcome screen. Switch to "After" to go through the full onboarding.</p>
    <button data-testid="preview-back-button" onClick={onBack} className="rounded-full border border-pomegranate-300 px-5 py-2 text-pomegranate-700">
      Back to welcome screen
    </button>
  </div>
);

const VersionToggle = ({ version, setVersion }) => (
  <div data-testid="preview-version-toggle" className="fixed bottom-4 right-4 z-50 flex gap-1 rounded-full bg-slate-900/85 p-1 text-xs text-white shadow-lg">
    {["before", "after"].map((v) => (
      <button
        key={v}
        data-testid={`preview-toggle-${v}`}
        onClick={() => setVersion(v)}
        className={`rounded-full px-4 py-1.5 capitalize ${version === v ? "bg-white text-slate-900" : "text-white/80"}`}
      >
        {v}
      </button>
    ))}
  </div>
);

function App() {
  const [version, setVersion] = useState("after");
  const [started, setStarted] = useState(false);

  const switchVersion = (v) => {
    resetPreview();
    setStarted(false);
    if (v === "after" && version === "after") window.location.href = "/";
    setVersion(v);
  };

  return (
    <div className="pomi-theme">
      <BrowserRouter>
        {version === "after" ? (
          <Start key="after" />
        ) : started ? (
          <BeforeNext onBack={() => setStarted(false)} />
        ) : (
          <IntroStepOriginal onStart={() => setStarted(true)} />
        )}
        <VersionToggle version={version} setVersion={switchVersion} />
      </BrowserRouter>
    </div>
  );
}

export default App;
