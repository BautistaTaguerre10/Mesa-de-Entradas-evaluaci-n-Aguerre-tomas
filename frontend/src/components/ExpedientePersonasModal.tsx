// Modal de consulta de personas vinculadas a un expediente.
import { Button, Modal, Table, Tag } from "antd";
import { Expediente } from "../types/domain";

interface ExpedientePersonasModalProps {
  open: boolean;
  expediente: Expediente | null;
  onCancel: () => void;
  onEdit: (expediente: Expediente) => void;
}

export function ExpedientePersonasModal({ open, expediente, onCancel, onEdit }: ExpedientePersonasModalProps) {
  return (
    <Modal
      title={expediente ? `Personas en ${expediente.clave}` : "Personas en expediente"}
      open={open}
      onCancel={onCancel}
      footer={
        expediente ? (
          <Button
            type="primary"
            onClick={() => {
              onCancel();
              onEdit(expediente);
            }}
          >
            Editar vinculos
          </Button>
        ) : null
      }
      width={760}
    >
      <Table
        rowKey="id"
        pagination={false}
        dataSource={expediente?.personas ?? []}
        columns={[
          {
            title: "Persona",
            render: (_, vinculo) => `${vinculo.persona.apellido}, ${vinculo.persona.nombre}`,
          },
          {
            title: "DNI",
            render: (_, vinculo) => vinculo.persona.dni,
            width: 140,
          },
          {
            title: "Vinculo",
            render: (_, vinculo) => (
              <Tag color={vinculo.esActorPrincipal ? "green" : "default"}>
                {vinculo.tipoVinculo.descripcion}
                {vinculo.esActorPrincipal ? " principal" : ""}
              </Tag>
            ),
            width: 180,
          },
        ]}
      />
    </Modal>
  );
}
