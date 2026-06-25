// Modal del formulario de expediente. Centraliza la carga de datos y personas vinculadas.
import { Button, Form, FormInstance, Input, InputNumber, Modal, Select, Space, Switch, Typography } from "antd";
import { Expediente, Organismo, Persona, TipoVinculo } from "../types/domain";
import { ciudadLabels } from "../utils/catalogs";
import { ExpedientePayload } from "../services/expedienteService";

type ExpedienteFormValues = ExpedientePayload;

interface ExpedienteFormModalProps {
  open: boolean;
  editing: Expediente | null;
  saving: boolean;
  form: FormInstance<ExpedienteFormValues>;
  organismos: Organismo[];
  personas: Persona[];
  tiposVinculo: TipoVinculo[];
  onCancel: () => void;
  onSubmit: (values: ExpedienteFormValues) => void;
  onSetActorPrincipal: (index: number, checked: boolean) => void;
}

export function ExpedienteFormModal({
  open,
  editing,
  saving,
  form,
  organismos,
  personas,
  tiposVinculo,
  onCancel,
  onSubmit,
  onSetActorPrincipal,
}: ExpedienteFormModalProps) {
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

  return (
    <Modal
      title={editing ? "Editar expediente" : "Nuevo expediente"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={saving}
      width={920}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <div className="form-grid">
          <Form.Item name="codigoOrganismo" label="Organismo" rules={[{ required: true, message: "Seleccione organismo" }]}>
            <Select
              disabled={Boolean(editing)}
              showSearch
              optionFilterProp="label"
              options={organismoOptions}
              onChange={(codigo: string) => {
                const organismo = organismos.find((item) => item.codigo === codigo);
                if (organismo) {
                  form.setFieldValue("ciudad", organismo.ciudad);
                }
              }}
            />
          </Form.Item>
          <Form.Item name="ciudad" label="Ciudad" rules={[{ required: true, message: "Seleccione ciudad" }]}>
            <Select disabled options={Object.entries(ciudadLabels).map(([value, label]) => ({ value, label }))} />
          </Form.Item>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: "Seleccione tipo" }]}>
            <Select
              disabled={Boolean(editing)}
              options={[
                { value: "EXP", label: "EXP" },
                { value: "LEG", label: "LEG" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="numero"
            label="Numero"
            extra={editing ? undefined : "Se asigna automaticamente al guardar."}
          >
            <InputNumber disabled min={1} placeholder="Automatico" className="full-width" />
          </Form.Item>
          <Form.Item name="anio" label="Año" rules={[{ required: true, message: "Ingrese año" }]}>
            <InputNumber disabled={Boolean(editing)} min={1900} max={2200} className="full-width" />
          </Form.Item>
        </div>

        <Form.Item name="caratula" label="Caratula" rules={[{ required: true, message: "Ingrese caratula" }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Typography.Title level={5}>Personas vinculadas</Typography.Title>
        <Form.List name="personas">
          {(fields, { add, remove }) => (
            <Space direction="vertical" className="page-stack">
              {fields.map((field) => (
                <div className="vinculo-row" key={field.key}>
                  <Form.Item
                    {...field}
                    name={[field.name, "personaId"]}
                    label="Persona"
                    rules={[{ required: true, message: "Seleccione persona" }]}
                  >
                    <Select showSearch optionFilterProp="label" options={personaOptions} />
                  </Form.Item>
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const vinculaciones = (form.getFieldValue("personas") ?? []) as ExpedienteFormValues["personas"];
                      const esPrincipal = Boolean(vinculaciones[field.name]?.esActorPrincipal);

                      return (
                        <Form.Item
                          {...field}
                          name={[field.name, "tipoVinculoId"]}
                          label="Vinculo"
                          rules={[{ required: true, message: "Seleccione vinculo" }]}
                        >
                          <Select disabled={esPrincipal} options={tipoVinculoOptions} />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, "esActorPrincipal"]} label="Actor principal" valuePropName="checked">
                    <Switch onChange={(checked) => onSetActorPrincipal(field.name, checked)} />
                  </Form.Item>
                  <Button danger onClick={() => remove(field.name)} disabled={fields.length === 1}>
                    Quitar
                  </Button>
                </div>
              ))}
              <Button
                onClick={() =>
                  add({ personaId: undefined, tipoVinculoId: undefined, esActorPrincipal: false })
                }
              >
                Agregar persona
              </Button>
            </Space>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
