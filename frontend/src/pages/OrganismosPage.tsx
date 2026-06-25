// Pagina de organismos. Permite ABM y filtros por ciudad o fuero.
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { organismoService, type OrganismoPayload } from "../services/organismoService";
import type { Ciudad, Fuero, Organismo } from "../types/domain";
import { buildOrganismoCodigo, ciudadLabels, fueroLabels } from "../utils/catalogs";

const ciudades = Object.entries(ciudadLabels).map(([value, label]) => ({ value, label }));
const fueros = Object.entries(fueroLabels).map(([value, label]) => ({ value, label }));

export function OrganismosPage() {
  const [organismos, setOrganismos] = useState<Organismo[]>([]);
  const [search, setSearch] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState<Ciudad | undefined>();
  const [fueroFilter, setFueroFilter] = useState<Fuero | undefined>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Organismo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<OrganismoPayload>();
  const ciudad = Form.useWatch("ciudad", form);
  const fuero = Form.useWatch("fuero", form);

  const loadOrganismos = async () => {
    try {
      setOrganismos(await organismoService.list());
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudieron cargar los organismos");
    }
  };

  useEffect(() => {
    void loadOrganismos();
  }, []);

  const filteredOrganismos = useMemo(() => {
    const term = search.trim().toLowerCase();

    return organismos.filter((organismo) => {
      const matchesText =
        !term ||
        [organismo.codigo, organismo.nombre, organismo.caratulaTitulo].some((value) =>
          value.toLowerCase().includes(term),
        );
      const matchesCiudad = !ciudadFilter || organismo.ciudad === ciudadFilter;
      const matchesFuero = !fueroFilter || organismo.fuero === fueroFilter;

      return matchesText && matchesCiudad && matchesFuero;
    });
  }, [ciudadFilter, fueroFilter, organismos, search]);

  useEffect(() => {
    const codigo = buildOrganismoCodigo(ciudad as Ciudad | undefined, fuero as Fuero | undefined);
    if (codigo) {
      form.setFieldValue("codigo", codigo);
    }
  }, [ciudad, fuero, form]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (organismo: Organismo) => {
    setEditing(organismo);
    form.setFieldsValue(organismo);
    setModalOpen(true);
  };

  const handleSubmit = async (values: OrganismoPayload) => {
    setSaving(true);
    try {
      if (editing) {
        await organismoService.update(editing.id, values);
      } else {
        await organismoService.create(values);
      }
      message.success("Organismo guardado");
      setModalOpen(false);
      await loadOrganismos();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudo guardar el organismo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await organismoService.delete(id);
      message.success("Organismo eliminado");
      await loadOrganismos();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudo eliminar el organismo");
    }
  };

  const columns: ColumnsType<Organismo> = [
    { title: "Codigo", dataIndex: "codigo", width: 120 },
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Caratula / Titulo", dataIndex: "caratulaTitulo" },
    { title: "Ciudad", dataIndex: "ciudad", render: (value: Ciudad) => ciudadLabels[value] },
    { title: "Fuero", dataIndex: "fuero", render: (value: Fuero) => fueroLabels[value] },
    {
      title: "Acciones",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Editar</Button>
          <Popconfirm title="Eliminar organismo" onConfirm={() => void handleDelete(record.id)}>
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" className="page-stack">
      <div className="page-heading">
        <div>
          <Typography.Title level={2}>Organismos</Typography.Title>
          <Typography.Text type="secondary">Registro de dependencias por ciudad y fuero.</Typography.Text>
        </div>
        <Button type="primary" onClick={openCreate}>
          Nuevo organismo
        </Button>
      </div>

      <div className="filter-bar">
        <Input.Search
          allowClear
          placeholder="Buscar por codigo, nombre o caratula"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          allowClear
          placeholder="Ciudad"
          value={ciudadFilter}
          options={ciudades}
          onChange={(value) => setCiudadFilter(value)}
        />
        <Select
          allowClear
          placeholder="Fuero"
          value={fueroFilter}
          options={fueros}
          onChange={(value) => setFueroFilter(value)}
        />
      </div>

      <Table rowKey="id" columns={columns} dataSource={filteredOrganismos} loading={loading} scroll={{ x: 840 }} />

      <Modal
        title={editing ? "Editar organismo" : "Nuevo organismo"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={(values) => void handleSubmit(values)}>
          <Form.Item
            name="ciudad"
            label="Ciudad"
            extra={editing ? "No se modifica en edicion para conservar expedientes asociados." : undefined}
            rules={[{ required: true, message: "Seleccione ciudad" }]}
          >
            <Select disabled={Boolean(editing)} options={ciudades} />
          </Form.Item>
          <Form.Item
            name="fuero"
            label="Fuero"
            extra={editing ? "No se modifica en edicion para conservar el codigo historico." : undefined}
            rules={[{ required: true, message: "Seleccione fuero" }]}
          >
            <Select disabled={Boolean(editing)} options={fueros} />
          </Form.Item>
          <Form.Item
            name="codigo"
            label="Codigo"
            extra="Se genera automaticamente segun ciudad y fuero."
            rules={[{ required: true, message: "Seleccione ciudad y fuero para generar el codigo" }]}
          >
            <Input disabled maxLength={5} />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: "Ingrese nombre" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="caratulaTitulo"
            label="Caratula / Titulo"
            rules={[{ required: true, message: "Ingrese caratula o titulo" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
