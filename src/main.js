import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserContextProvider } from "./contexts/user.context";
createRoot(document.getElementById("root")).render(_jsxs(StrictMode, { children: [_jsx(UserContextProvider, { children: _jsx(App, {}) }), ","] }));
