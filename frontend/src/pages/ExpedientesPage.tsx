// Pagina de expedientes. Gestiona filtros, ABM y reglas del actor principal.
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { expedienteService, type ExpedientePayload } from "../services/expedienteService";
import { organismoService } from "../services/organismoService";
import { personaService } from "../services/personaService";
import { tipoVinculoService } from "../services/tipoVinculoService";
import type { Ciudad, Expediente, Fuero, Organismo, Persona, TipoExpediente, TipoVinculo } from "../types/domain";
import { ciudadLabels, fueroLabels, tipoExpedienteLabels } from "../utils/catalogs";
import { ExpedienteFormModal } from "../components/ExpedienteFormModal";
import { ExpedientePersonasModal } from "../components/ExpedientePersonasModal";

type ExpedienteFormValues = ExpedientePayload;

export function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [organismos, setOrganismos] = useState<Organismo[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [tiposVinculo, setTiposVinculo] = useState<TipoVinculo[]>([]);
  const [search, setSearch] = useState("");
  const [ciudadFilter, setCiudadFilter] = useState<Ciudad | undefined>();
  const [fueroFilter, setFueroFilter] = useState<Fuero | undefined>();
  const [tipoFilter, setTipoFilter] = useState<TipoExpediente | undefined>();
  const [anioFilter, setAnioFilter] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Expediente | null>(null);
  const [selectedExpedientePersonas, setSelectedExpedientePersonas] = useState<Expediente | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [personasModalOpen, setPersonasModalOpen] = useState(false);
  const [form] = Form.useForm<ExpedienteFormValues>();

  const actorVinculo = useMemo(
    () => tiposVinculo.find((tipo) => tipo.descripcion === "ACTOR"),
    [tiposVinculo],
  );

  const organismoOptions = organismos.map((organismo) => ({
    value: organismo.codigo,
    label: `${organismo.codigo} - ${organismo.nombre}`,
  }));

  const personaOptions = personas.map((persona) => ({
    value: persona.id,
    label: `${persona.apellido}, ${persona.nombre} - DNI ${persona.dni}`,
  }));

  const tipoVinculoOptions = tiposVinculo.map((tipo) => ({
    value: tipo.id,
    label: tipo.descripcion,
  }));

  const anioOptions = useMemo(
    () =>
      Array.from(new Set(expedientes.map((expediente) => expediente.anio)))
        .sort((left, right) => right - left)
        .map((anio) => ({ value: anio, label: String(anio) })),
    [expedientes],
  );

  const filteredExpedientes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return expedientes.filter((expediente) => {
      const personasText = expediente.personas
        .map((vinculo) => `${vinculo.persona.dni} ${vinculo.persona.apellido} ${vinculo.persona.nombre}`)
        .join(" ");
      const matchesText =
        !term ||
        [
          expediente.clave,
          expediente.codigoOrganismo,
          expediente.caratula,
          String(expediente.numero),
          String(expediente.anio),
          personasText,
        ].some((value) => value.toLowerCase().includes(term));
      const matchesCiudad = !ciudadFilter || expediente.ciudad === ciudadFilter;
      const matchesFuero = !fueroFilter || expediente.organismo.fuero === fueroFilter;
      const matchesTipo = !tipoFilter || expediente.tipo === tipoFilter;
      const matchesAnio = !anioFilter || expediente.anio === anioFilter;

      return matchesText && matchesCiudad && matchesFuero && matchesTipo && matchesAnio;
    });
  }, [anioFilter, ciudadFilter, expedientes, fueroFilter, search, tipoFilter]);

  const loadAll = async () => {
    try {
      const [expedientesData, organismosData, personasData, tiposData] = await Promise.all([
        expedienteService.list(),
        organismoService.list(),
        personaService.list(),
        tipoVinculoService.list(),
      ]);
      setExpedientes(expedientesData);
      setOrganismos(organismosData);
      setPersonas(personasData);
      setTiposVinculo(tiposData);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudieron cargar los expedientes");
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      tipo: "EXP",
      anio: new Date().getFullYear(),
      personas: [{ personaId: undefined as unknown as number, tipoVinculoId: actorVinculo?.id ?? 0, esActorPrincipal: true }],
    });
    setModalOpen(true);
  };

  const setActorPrincipal = (index: number, checked: boolean) => {
    const vinculaciones = (form.getFieldValue("personas") ?? []) as ExpedienteFormValues["personas"];

    if (!checked) {
      form.setFieldValue(["personas", index, "esActorPrincipal"], false);
      return;
    }

    form.setFieldValue(
      "personas",
      vinculaciones.map((vinculo, currentIndex) => ({
        ...vinculo,
        esActorPrincipal: currentIndex === index,
        tipoVinculoId: currentIndex === index && actorVinculo ? actorVinculo.id : vinculo.tipoVinculoId,
      })),
    );
  };

  const openEdit = (expediente: Expediente) => {
    setEditing(expediente);
    form.setFieldsValue({
      codigoOrganismo: expediente.codigoOrganismo,
      tipo: expediente.tipo,
      numero: expediente.numero,
      anio: expediente.anio,
      caratula: expediente.caratula,
      ciudad: expediente.ciudad,
      personas: expediente.personas.map((persona) => ({
        personaId: persona.personaId,
        tipoVinculoId: persona.tipoVinculoId,
        esActorPrincipal: persona.esActorPrincipal,
      })),
    });
    setModalOpen(true);
  };

  const openPersonas = (expediente: Expediente) => {
    setSelectedExpedientePersonas(expediente);
    setPersonasModalOpen(true);
  };

  const validateBusinessRules = (values: ExpedienteFormValues) => {
    const principales = values.personas.filter((persona) => persona.esActorPrincipal);

    if (principales.length !== 1) {
      message.error("Debe indicar exactamente un actor principal");
      return false;
    }

    if (!actorVinculo || principales[0]?.tipoVinculoId !== actorVinculo.id) {
      message.error("El actor principal debe tener vinculo ACTOR");
      return false;
    }

    const personasUnicas = new Set(values.personas.map((persona) => persona.personaId));
    if (personasUnicas.size !== values.personas.length) {
      message.error("Una persona no puede tener mas de un vinculo en el mismo expediente");
      return false;
    }

    return true;
  };

  const handleSubmit = async (values: ExpedienteFormValues) => {
    if (!validateBusinessRules(values)) {
      return;
    }

    const payload: ExpedientePayload = {
      ...values,
      personas: values.personas.map((persona) => ({
        ...persona,
        esActorPrincipal: Boolean(persona.esActorPrincipal),
      })),
    };

    setSaving(true);
    try {
      if (editing) {
        await expedienteService.update(editing.id, payload);
      } else {
        await expedienteService.create(payload);
      }
      message.success("Expediente guardado");
      setModalOpen(false);
      await loadAll();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudo guardar el expediente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await expedienteService.delete(id);
      message.success("Expediente eliminado");
      await loadAll();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudo eliminar el expediente");
    }
  };

  const columns: ColumnsType<Expediente> = [
    { title: "Clave", dataIndex: "clave", width: 180 },
    { title: "Caratula", dataIndex: "caratula" },
    { title: "Organismo", dataIndex: "codigoOrganismo", width: 130 },
    { title: "Ciudad", dataIndex: "ciudad", render: (value: Ciudad) => ciudadLabels[value], width: 160 },
    { title: "Tipo", dataIndex: "tipo", render: (value: TipoExpediente) => tipoExpedienteLabels[value], width: 120 },
    {
      title: "Personas",
      render: (_, record) => (
        <Space wrap>
          {record.personas.map((vinculo) => (
            <Tag key={vinculo.id} color={vinculo.esActorPrincipal ? "green" : "default"}>
              {vinculo.persona.apellido} {vinculo.persona.nombre} - {vinculo.tipoVinculo.descripcion}
              {vinculo.esActorPrincipal ? " principal" : ""}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Acciones",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Editar</Button>
          <Button onClick={() => openPersonas(record)}>Personas</Button>
          <Popconfirm title="Eliminar expediente" onConfirm={() => void handleDelete(record.id)}>
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
          <Typography.Title level={2}>Expedientes</Typography.Title>
          <Typography.Text type="secondary">Registro de causas y vinculacion de personas.</Typography.Text>
        </div>
        <Button type="primary" onClick={openCreate} disabled={!organismos.length || !personas.length}>
          Nuevo expediente
        </Button>
      </div>

      <div className="filter-bar">
        <Input.Search
          allowClear
          placeholder="Buscar por clave, caratula, persona u organismo"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          allowClear
          placeholder="Ciudad"
          value={ciudadFilter}
          options={Object.entries(ciudadLabels).map(([value, label]) => ({ value, label }))}
          onChange={(value) => setCiudadFilter(value)}
        />
        <Select
          allowClear
          placeholder="Fuero"
          value={fueroFilter}
          options={Object.entries(fueroLabels).map(([value, label]) => ({ value, label }))}
          onChange={(value) => setFueroFilter(value)}
        />
        <Select
          allowClear
          placeholder="Tipo"
          value={tipoFilter}
          options={[
            { value: "EXP", label: "EXP" },
            { value: "LEG", label: "LEG" },
          ]}
          onChange={(value) => setTipoFilter(value)}
        />
        <Select allowClear placeholder="Año" value={anioFilter} options={anioOptions} onChange={(value) => setAnioFilter(value)} />
      </div>

      <Table rowKey="id" columns={columns} dataSource={filteredExpedientes} loading={loading} scroll={{ x: 1100 }} />

      <ExpedienteFormModal
        open={modalOpen}
        editing={editing}
        saving={saving}
        form={form}
        organismos={organismos}
        personas={personas}
        tiposVinculo={tiposVinculo}
        onCancel={() => setModalOpen(false)}
        onSubmit={(values) => void handleSubmit(values)}
        onSetActorPrincipal={setActorPrincipal}
      />

      <ExpedientePersonasModal
        open={personasModalOpen}
        expediente={selectedExpedientePersonas}
        onCancel={() => setPersonasModalOpen(false)}
        onEdit={openEdit}
      />
    </Space>
  );
}
