// Servicio de tipos de vinculo. Lee el catalogo desde la base.
import { TipoVinculoRepository } from "../repositories/tipoVinculoRepository";

export class TipoVinculoService {
  constructor(private readonly repository = new TipoVinculoRepository()) {}

  list() {
    return this.repository.findAll();
  }
}
