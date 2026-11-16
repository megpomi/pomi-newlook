import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Start from "@/pages/Start";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PomiLoader from "@/components/PomiLoader";
import IntroStepOriginal from "@/pomi/IntroStepOriginal";
import { resetPreview, previewAsSignedIn } from "@/api/base44Client";

const BeforeNext = ({ onBack }) => (
  <div data-testid="preview-next-step" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-slate-600">
    <p>The "Before" view only covers the welcome screen. Switch to "After" to go through the full onboarding.</p>
    <button data-testid="preview-back-button" onClick={onBack} className="rounded-full border border-pomegranate-300 px-5 py-2 text-pomegranate-700">
      Back to welcome screen
    </button>
  </div>
);

const go = (fn, to = "/") => {
  fn();
  window.location.href = to;
};

const PreviewMenu = ({ version, setVersion }) => {
  const [open, setOpen] = useState(false);
  const item = "block w-full rounded-full px-4 py-1.5 text-left hover:bg-white/10";
  return (
    <div data-testid="preview-menu" className="fixed bottom-3 left-3 z-50 text-xs text-white">
      {open && (
        <div className="mb-2 w-48 space-y-0.5 rounded-2xl bg-slate-900/90 p-1.5 shadow-lg">
          {setVersion && (
            <>
              <button data-testid="preview-toggle-before" onClick={() => setVersion("before")} className={item}>
                Welcome: before {version === "before" && "✓"}
              </button>
              <button data-testid="preview-toggle-after" onClick={() => setVersion("after")} className={item}>
                Welcome: after {version === "after" && "✓"}
              </button>
            </>
          )}
          <button data-testid="preview-open-dashboard" onClick={() => go(previewAsSignedIn)} className={item}>
            Signed-in dashboard
          </button>
          <button data-testid="preview-open-loader" onClick={() => go(() => {}, "/preview-loader")} className={item}>
            Loading screen
          </button>
          <button data-testid="preview-reset" onClick={() => go(resetPreview)} className={item}>
            Reset (signed out)
          </button>
        </div>
      )}
      <button data-testid="preview-menu-button" onClick={() => setOpen(!open)} className="rounded-full bg-slate-900/85 px-4 py-2 shadow-lg">
        Preview {open ? "▾" : "▴"}
      </button>
    </div>
  );
};

const Welcome = () => {
  const [version, setVersion] = useState("after");
  const [started, setStarted] = useState(false);
  const switchVersion = (v) => {
    setStarted(false);
    setVersion(v);
  };
  return (
    <>
      {version === "after" ? (
        <Start />
      ) : started ? (
        <BeforeNext onBack={() => setStarted(false)} />
      ) : (
        <IntroStepOriginal onStart={() => setStarted(true)} />
      )}
      <PreviewMenu version={version} setVersion={switchVersion} />
    </>
  );
};

const WithMenu = ({ children }) => (
  <>
    {children}
    <PreviewMenu />
  </>
);

const PreviewPages = () => {
  const { pathname } = useLocation();
  return (
    <Routes key={pathname}>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<WithMenu><Login /></WithMenu>} />
      <Route path="/register" element={<WithMenu><Register /></WithMenu>} />
      <Route path="/forgot-password" element={<WithMenu><ForgotPassword /></WithMenu>} />
      <Route path="/about" element={<WithMenu><About /></WithMenu>} />
      <Route path="/contact" element={<WithMenu><Contact /></WithMenu>} />
      <Route path="/preview-loader" element={<WithMenu><PomiLoader /></WithMenu>} />
      <Route path="*" element={<Welcome />} />
    </Routes>
  );
};

function App() {
  return (
    <div className="pomi-theme">
      <BrowserRouter>
        <PreviewPages />
      </BrowserRouter>
    </div>
  );
}

export default App;
