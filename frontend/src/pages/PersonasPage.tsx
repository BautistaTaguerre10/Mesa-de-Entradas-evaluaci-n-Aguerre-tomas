// Pagina de personas. Permite ABM, busqueda y ver expedientes asociados.
import { Button, Form, Input, Modal, Popconfirm, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { personaService, type PersonaPayload } from "../services/personaService";
import type { Ciudad, Expediente, Persona, TipoExpediente } from "../types/domain";
import { ciudadLabels, tipoExpedienteLabels } from "../utils/catalogs";

export function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Persona | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expedientesModalOpen, setExpedientesModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [expedientesPersona, setExpedientesPersona] = useState<Expediente[]>([]);
  const [loadingExpedientes, setLoadingExpedientes] = useState(false);
  const [form] = Form.useForm<PersonaPayload>();

  const loadPersonas = async () => {
    try {
      setPersonas(await personaService.list());
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudieron cargar las personas");
    }
  };

  useEffect(() => {
    void loadPersonas();
  }, []);

  const filteredPersonas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return personas;
    }

    return personas.filter((persona) =>
      [persona.dni, persona.apellido, persona.nombre].some((value) => value.toLowerCase().includes(term)),
    );
  }, [personas, search]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (persona: Persona) => {
    setEditing(persona);
    form.setFieldsValue(persona);
    setModalOpen(true);
  };

  const handleSubmit = async (values: PersonaPayload) => {
    setSaving(true);
    try {
      if (editing) {
        await personaService.update(editing.id, values);
      } else {
        await personaService.create(values);
      }
      message.success("Persona guardada");
      setModalOpen(false);
      await loadPersonas();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudo guardar la persona");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await personaService.delete(id);
      message.success("Persona eliminada");
      await loadPersonas();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudo eliminar la persona");
    }
  };

  const openExpedientes = async (persona: Persona) => {
    setSelectedPersona(persona);
    setExpedientesModalOpen(true);
    setLoadingExpedientes(true);
    try {
      setExpedientesPersona(await personaService.listExpedientes(persona.id));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudieron cargar los expedientes");
    } finally {
      setLoadingExpedientes(false);
    }
  };

  const columns: ColumnsType<Persona> = [
    { title: "DNI", dataIndex: "dni", width: 140 },
    {
      title: "Persona",
      render: (_, record) => `${record.apellido}, ${record.nombre}`,
    },
    {
      title: "Acciones",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Editar</Button>
          <Button onClick={() => void openExpedientes(record)}>Expedientes</Button>
          <Popconfirm
            title="Eliminar persona"
            description="Solo se puede eliminar si no participa en expedientes."
            onConfirm={() => void handleDelete(record.id)}
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expedienteColumns: ColumnsType<Expediente> = [
    { title: "Clave", dataIndex: "clave", width: 180 },
    { title: "Caratula / Titulo", dataIndex: "caratula" },
    { title: "Organismo", dataIndex: "codigoOrganismo", width: 130 },
    { title: "Ciudad", dataIndex: "ciudad", render: (value: Ciudad) => ciudadLabels[value], width: 160 },
    { title: "Tipo", dataIndex: "tipo", render: (value: TipoExpediente) => tipoExpedienteLabels[value], width: 120 },
    {
      title: "Vinculo",
      width: 160,
      render: (_, record) => {
        const vinculo = record.personas[0];
        return vinculo ? (
          <Tag color={vinculo.esActorPrincipal ? "green" : "default"}>
            {vinculo.tipoVinculo.descripcion}
            {vinculo.esActorPrincipal ? " principal" : ""}
          </Tag>
        ) : null;
      },
    },
  ];

  return (
    <Space direction="vertical" size="large" className="page-stack">
      <div className="page-heading">
        <div>
          <Typography.Title level={2}>Personas</Typography.Title>
          <Typography.Text type="secondary">Administracion de partes y participantes.</Typography.Text>
        </div>
        <Button type="primary" onClick={openCreate}>
          Nueva persona
        </Button>
      </div>

      <div className="filter-bar">
        <Input.Search
          allowClear
          placeholder="Buscar por DNI, apellido o nombre"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <Table rowKey="id" columns={columns} dataSource={filteredPersonas} loading={loading} scroll={{ x: 720 }} />

      <Modal
        title={editing ? "Editar persona" : "Nueva persona"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={(values) => void handleSubmit(values)}>
          <Form.Item
            name="dni"
            label="DNI"
            extra="Puede editarse para corregir errores, pero no puede repetirse."
            rules={[{ required: true, message: "Ingrese DNI" }]}
          >
            <Input maxLength={12} />
          </Form.Item>
          <Form.Item name="apellido" label="Apellido" rules={[{ required: true, message: "Ingrese apellido" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: "Ingrese nombre" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          selectedPersona
            ? `Expedientes de ${selectedPersona.apellido}, ${selectedPersona.nombre}`
            : "Expedientes de la persona"
        }
        open={expedientesModalOpen}
        onCancel={() => setExpedientesModalOpen(false)}
        footer={null}
        width={980}
      >
        <Table
          rowKey="id"
          columns={expedienteColumns}
          dataSource={expedientesPersona}
          loading={loadingExpedientes}
          scroll={{ x: 900 }}
        />
      </Modal>
    </Space>
  );
}
