import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const sessionId = import.meta.env.VITE_SESSION_ID;
const sessionModules = import.meta.glob<{ default: ComponentType }>(
  "../sessions/*/App.tsx"
);
const modulePath = `../sessions/${sessionId}/App.tsx`;
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

const root = createRoot(rootElement);
const loadSession = sessionModules[modulePath];

if (!sessionId || !loadSession) {
  root.render(
    <main className="training-shell">
      <h1>Для активной сессии нет интерактивного приложения</h1>
      <p>Откройте README текущей карточки и выполните указанное упражнение.</p>
    </main>
  );
} else {
  void loadSession().then(({ default: SessionApp }) => {
    root.render(
      <StrictMode>
        <main className="training-shell">
          <SessionApp />
        </main>
      </StrictMode>
    );
  });
}
