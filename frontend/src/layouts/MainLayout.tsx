// Layout principal de la aplicacion. Contiene sidebar, encabezado y area de contenido.
import {
  BarChartOutlined,
  BankOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: "/dashboard", icon: <BarChartOutlined />, label: "Estadisticas" },
  { key: "/expedientes", icon: <FileTextOutlined />, label: "Expedientes" },
  { key: "/personas", icon: <TeamOutlined />, label: "Personas" },
  { key: "/organismos", icon: <BankOutlined />, label: "Organismos" },
];

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className="app-shell">
      <Sider breakpoint="lg" collapsedWidth={0} className="app-sider">
        <div className="mb-5 mt-5" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <img src="/poder.png" alt="Poder Judicial" style={{ width: "80px", height: "auto", objectFit: "contain" }} />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Typography.Title level={3} className="app-title">
            Poder Judicial / Mesa de Entradas
          </Typography.Title>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
