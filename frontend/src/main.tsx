// Punto de entrada del frontend. Monta React y configura Ant Design.
import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import { App } from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          colorPrimary: "#1d4ed8",
          colorInfo: "#1d4ed8",
          colorLink: "#1d4ed8",
          colorBgLayout: "#f5f8ff",
          colorText: "#10233f",
          colorBorder: "#d8e3f4",
          borderRadius: 6,
          fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        },
        components: {
          Layout: {
            siderBg: "#ffffff",
            headerBg: "#ffffff",
            bodyBg: "#f5f8ff",
          },
          Menu: {
            itemSelectedBg: "#e8f0ff",
            itemSelectedColor: "#1d4ed8",
            itemHoverBg: "#f1f6ff",
            itemHoverColor: "#1d4ed8",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
