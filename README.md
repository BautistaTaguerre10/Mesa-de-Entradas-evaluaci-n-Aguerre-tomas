# Mesa de Entradas Virtual
Aplicacion web fullstack para gestionar expedientes judiciales, personas, organismos y vinculos entre personas y expedientes.

Link de la app desplegada: https://mesa-de-entradas-evaluaci-n-aguerre-tomas-production.up.railway.app/dashboard

## Stack
- Frontend: Vite, React, TypeScript y Ant Design.
- Backend: Node.js, Express y TypeScript.
- ORM: Prisma.
- Base de datos: PostgreSQL en Supabase.

## Decisiones de diseño
- Se uso arquitectura por capas en backend: rutas, controladores, servicios y repositorios. modelo vista controlador.
- Las reglas de negocio se ubicaron en servicios.
- Se uso Prisma para tipado, migraciones y consultas a PostgreSQL.
- Se uso PostgreSQL como base de datos en Supabase.
- Se agrego `ExpedientePersona` para representar la relacion muchos a muchos entre personas y expedientes.
- Se uso Ant Design para tablas, formularios, modales, filtros y layout.
- Se eligio una paleta azul y blanca para una apariencia institucional.

## Dificultades encontradas
- La app usa `DATABASE_URL` para conectarse a PostgreSQL.
- No se permite borrar personas vinculadas a expedientes para conservar integridad referencial.
- La carga demo puede tardar por latencia al usar una base de datos remota.

## Funcionalidades
- Registrar, editar, listar y eliminar personas.
- Registrar, editar, listar y eliminar organismos.
- Registrar, editar, listar y eliminar expedientes.
- Asociar personas a expedientes con vinculos `ACTOR`, `DEMANDADO`, `CONDENADO` o `VICTIMA`.
- Validar que cada expediente tenga exactamente un actor principal.
- Listar expedientes de una persona.
- Listar personas de un expediente.
- Buscar y filtrar personas, organismos y expedientes.
- Mostrar estadisticas de expedientes por año, ciudad y fuero.

## Modelo de datos

Tablas principales:

- `Persona`: DNI, apellido y nombre.
- `Organismo`: codigo, nombre, caratula/titulo, ciudad y fuero.
- `Expediente`: codigo de organismo, tipo, numero, año, caratula/titulo, ciudad y clave.
- `TipoVinculo`: descripcion del vinculo.
- `ExpedientePersona`: tabla intermedia entre expedientes y personas.

Valores permitidos:

- Ciudades: Neuquén, Zapala, Junín de los Andes.
- Fueros: Ejecutivos, Civil, Laboral, Familia.
- Tipos de expediente: `EXP`, `LEG`.
- Tipos de vinculo iniciales: `ACTOR`, `DEMANDADO`, `CONDENADO`, `VICTIMA`.

Reglas principales:
- El DNI de persona es unico.
- El codigo de organismo es unico.
- La clave del expediente se genera automaticamente:
CODIGO_ORGANISMO TIPO NUMERO/AÑO
- Todo expediente debe tener exactamente un actor principal.
- El actor principal siempre debe tener vinculo `ACTOR`.
- Una persona no se puede eliminar si participa en expedientes.

## Estructura

backend/
  prisma/
  src/
    controllers/
    routes/
    services/
    repositories/
    middlewares/
    config/
    types/
    utils/

frontend/
  src/
    pages/
    components/
    layouts/
    services/
    hooks/
    types/
    routes/
    utils/

## Variables de entorno

Crear el archivo:
backend/.env

Ejemplo local:
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/mesa_entradas"
CORS_ORIGIN="http://localhost:5173"

Notas:
- `DATABASE_URL` se usa para la conexion normal de la aplicacion y para migraciones de Prisma.
- Si la contraseña tiene caracteres especiales, deben codificarse en URL. Por ejemplo, `#` se escribe `%23`.

## Puesta en marcha local
Desde la raiz del proyecto:

```bash
npm install
```

Generar Prisma Client:

```bash
npm run prisma:generate --workspace backend
```

Aplicar migraciones:
```bash
npm run prisma:deploy --workspace backend
```
Cargar tipos de vinculo iniciales:
```bash
npm run prisma:seed --workspace backend
```

Levantar frontend y backend:
```bash
npm run dev
```

URLs:
Frontend: http://localhost:5173
Backend:  http://localhost:4000/api
Health:   http://localhost:4000/api/health

## Ejecutar por separado si es necesario
Backend:

```bash
npm run dev --workspace backend
```
Frontend:

```bash
npm run dev --workspace frontend
```

## Datos demo
Para cargar datos de prueba:

```bash
npm run prisma:seed-demo --workspace backend
```
Este comando crea personas, organismos, expedientes y vinculos demo para probar listados, filtros y estadisticas.

## Build y ejecucion en produccion

Compilar el proyecto:
```bash
npm run build
Iniciar la app compilada:
npm run start
```

## Despliegue desde GitHub
Subir este repo a GitHub y configurar el proveedor de hosting elegido con las variables necesarias:

```bash
DATABASE_URL="URL_DE_POSTGRESQL"
DIRECT_URL = "URL_DEL_DIRECT_ACCESS"
CORS_ORIGIN="ORIGEN_PERMITIDO_DEL_FRONTEND"
```

## actulizaciones futruas 
-login para usuarios
-Roles y permisos
