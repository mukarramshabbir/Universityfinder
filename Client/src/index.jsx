import "../tailwind.css";
import "../tailwind.config.js";
import "../global.css";
import React from "react";
import ReactDOMClient from "react-dom/client";
import { MobuleBusiness } from "./screens/MobuleBusiness";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);
root.render(<MobuleBusiness />);
