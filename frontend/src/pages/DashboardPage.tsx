// Pagina de estadisticas. Muestra totales y distribuciones de expedientes.
import { Alert, Card, Col, Empty, Progress, Row, Space, Statistic, Table, Typography } from "antd";
import { useCallback } from "react";
import { useLoadable } from "../hooks/useLoadable";
import { statisticsService } from "../services/statisticsService";
import { ciudadLabels, fueroLabels, tipoExpedienteLabels } from "../utils/catalogs";

export function DashboardPage() {
  const loader = useCallback(() => statisticsService.dashboard(), []);
  const { data, loading, error } = useLoadable(loader);

  const maxByFuero = Math.max(...(data?.expedientesPorFuero.map((item) => item.total) ?? [1]));
  const maxByCiudad = Math.max(...(data?.expedientesPorCiudad.map((item) => item.total) ?? [1]));
  const maxByAnio = Math.max(...(data?.expedientesPorAnio.map((item) => item.total) ?? [1]));

  const tramiteColumns = [
    {
      title: "Ciudad",
      dataIndex: "ciudad",
      render: (value: keyof typeof ciudadLabels) => ciudadLabels[value],
    },
    { title: "Ejecutivos", dataIndex: "ejecutivos", align: "right" as const },
    { title: "Civil", dataIndex: "civil", align: "right" as const },
    { title: "Laboral", dataIndex: "laboral", align: "right" as const },
    { title: "Familia", dataIndex: "familia", align: "right" as const },
    { title: "Total", dataIndex: "total", align: "right" as const },
  ];

  return (
    <Space direction="vertical" size="large" className="page-stack">
      <div>
        <Typography.Title level={2}>Estadísticas e Indicadores Generales</Typography.Title>
      </div>

      {error ? <Alert type="error" message={error} showIcon /> : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title="Expedientes" value={data?.totales.expedientes ?? 0} />
            {data?.expedientesPorTipo.length ? (
              <div className="stat-subtotals">
                {data.expedientesPorTipo.map((item) => (
                  <span key={item.tipo}>
                    {tipoExpedienteLabels[item.tipo]}: <strong>{item.total}</strong>
                  </span>
                ))}
              </div>
            ) : null}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title="Personas" value={data?.totales.personas ?? 0} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title="Organismos" value={data?.totales.organismos ?? 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Expedientes por año" loading={loading}>
            {data?.expedientesPorAnio.length ? (
              <Space direction="vertical" className="page-stack">
                {data.expedientesPorAnio.map((item) => (
                  <div key={item.anio}>
                    <Typography.Text>{item.anio}</Typography.Text>
                    <Progress percent={Math.round((item.total / maxByAnio) * 100)} format={() => item.total} />
                  </div>
                ))}
              </Space>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Expedientes por ciudad" loading={loading}>
            {data?.expedientesPorCiudad.length ? (
              <Space direction="vertical" className="page-stack">
                {data.expedientesPorCiudad.map((item) => (
                  <div key={item.ciudad}>
                    <Typography.Text>{ciudadLabels[item.ciudad]}</Typography.Text>
                    <Progress percent={Math.round((item.total / maxByCiudad) * 100)} format={() => item.total} />
                  </div>
                ))}
              </Space>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Expedientes por fuero" loading={loading}>
            {data?.expedientesPorFuero.length ? (
              <Space direction="vertical" className="page-stack">
                {data.expedientesPorFuero.map((item) => (
                  <div key={item.fuero}>
                    <Typography.Text>{fueroLabels[item.fuero]}</Typography.Text>
                    <Progress percent={Math.round((item.total / maxByFuero) * 100)} format={() => item.total} />
                  </div>
                ))}
              </Space>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Expedientes en trámite por ciudad y fuero" loading={loading}>
        {data?.expedientesEnTramitePorCiudadYFuero.length ? (
          <Table
            rowKey="ciudad"
            pagination={false}
            columns={tramiteColumns}
            dataSource={data.expedientesEnTramitePorCiudadYFuero}
            scroll={{ x: 720 }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
    </Space>
  );
}
