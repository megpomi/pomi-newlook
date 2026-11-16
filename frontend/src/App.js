import { useState } from "react";
import "@/App.css";
import { BrowserRouter } from "react-router-dom";
import IntroStep from "@/pomi/IntroStep";
import IntroStepOriginal from "@/pomi/IntroStepOriginal";

const NextStep = ({ onBack }) => (
  <div data-testid="preview-next-step" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-slate-600">
    <p>"Start with Pomi" was clicked. In the real app, the first onboarding question appears here.</p>
    <button data-testid="preview-back-button" onClick={onBack} className="rounded-full border border-pomegranate-300 px-5 py-2 text-pomegranate-700">
      Back to welcome screen
    </button>
  </div>
);

const VersionToggle = ({ version, setVersion }) => (
  <div data-testid="preview-version-toggle" className="fixed top-24 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full bg-slate-900/85 p-1 text-xs text-white shadow-lg">
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
  const Screen = version === "after" ? IntroStep : IntroStepOriginal;

  return (
    <div className="pomi-theme">
      <BrowserRouter>
        {started ? (
          <NextStep onBack={() => setStarted(false)} />
        ) : (
          <Screen key={version} onStart={() => setStarted(true)} />
        )}
        <VersionToggle version={version} setVersion={(v) => { setVersion(v); setStarted(false); }} />
      </BrowserRouter>
    </div>
  );
}

export default App;
