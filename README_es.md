# Bienvenido a nuestro proyecto / Welcome to our project

- [🇬🇧 Read in English](README.md)

# Agenda de Consultorios - Laboratorio 2

Repositorio donde se encuentra el código fuente para el proyecto Agenda de Consultorios, correspondiente a la materia Laboratorio 2, de la carrera "Técnicatura Universitaria en Desarrollo de Software" de la [Universidad de la Punta](https://www.ulp.edu.ar/) de San Luis, Argentina.

## Integrantes

- [Angel Emanuel](https://github.com/EmanuelAngel)
- [Alcaraz Rodrigo Nicolás](https://github.com/RodrigoNAlcaraz)

## Recomendaciones

- **Node.js** Versión utilizada en el proyecto: v20.14. [Versión LTS Recomendada](https://nodejs.org/en/download/prebuilt-installer)

## Descripción

- Registrarse, iniciar sesión y cerrar sesión.
- Crear, listar, editar, activar y desactivar pacientes.
- Crear, listar, editar, activar y desactivar profesionales (médicos).
- Crear, listar, editar, activar y desactivar especialidades.
- Listar agendas
- Asignar un turno a un paciente en un horario disponible de una agenda.

## Detalles

- Un paciente puede tener ninguna o varias obras sociales.
- Un profesional puede tener una o más especialidades.
- Cada agenda corresponde a una matrícula de una especialidad de un profesional.
- Los turnos de las agendas pueden ser en distintos días, tanto en la mañana como en la tarde.
- Los horarios de las agendas pueden estar cortados, pudiendo tener horarios no disponibles en un mismo día.
- Acceso seguro a la aplicación basado en roles (por ejemplo, administrador, profesional, paciente).

## Instrucciones para poder ejecutar el proyecto de manera local

1. Clonar el repositorio

```bash
git clone https://github.com/EmanuelAngel/lab-2.git
```

2. Moverse a la carpeta clonada

```bash
cd lab-2
```

3. Instalar las dependecias

```bash
npm|yarn|pnpm install
```

4. Descargar la copia de la base de datos e importarla a un gestor mysql

5. Crear un archivo .env y modificar las variables de entorno correspondientes a su entorno

```bash
NODE_ENV = development
PORT = 3001
DB_HOST = localhost
DB_USER = root
DB_PORT = 3306
DB_PASS =
DB_NAME = mydb
DB_CONNECTION_LIMIT = 10
JWT_SECRET = secret_very_secret
JWT_EXPIRES = 1h
```

6. Ejecutar el servidor

```bash
npm|yarn|pnpm run dev
```

## Estructura del proyecto

```bash
.
├── public/                 # Archivos estáticos (CSS, JS)
├── views/                  # Vistas dinámicas en Pug
├── src/                    # Código fuente principal
│   ├── .bin/               # Punto de entrada - Servidor
│   ├── config/             # Configuración de base de datos
│   ├── middlewares/        # Middlewares de la aplicación
│   ├── migrations/         # Historial de cambios en la base de datos
│   ├── apps/               # Módulos de la aplicación
│   │   ├── agenda_base/    # Módulo de Agenda
│   │   │   ├── agenda_base.http   # Testing para peticiones HTTP
│   │   │   ├── controller.js
│   │   │   ├── router.js
│   │   │   ├── model.js
│   │   │   └── schema.js          # Esquemas de validación
│   │   ├── auth/           # Módulo de autenticación y autorización
│   │   ├── pacientes/      # Módulo de Pacientes
│   │   ├── profesionales/  # Módulo de Profesionales
│   │   └── ...             # Otros módulos
│   └── app.js              # Configuración principal de la aplicación
├── package.json
├── db.copy.sql             # Versión más reciente de la base de datos
└── .env                    # Variables de entorno
```

## Tecnologías utilizadas

- [Express v4.19.0](https://expressjs.com/): Framework de Node.js.
- [MySQL v8.0](https://www.mysql.com/): Sistema de gestión de bases de datos relacional. - Usado para el almacenamiento persistente de datos de pacientes, profesionales, etc.
- [Pug](https://pugjs.org/): Motor de plantillas para Node.js - Usado para generar vistas dinámicas.
- [Bootstrap](https://getbootstrap.com/): Kit de herramientas frontend.
- [Bootstrap Icons](https://icons.getbootstrap.com/): Iconos para Bootstrap.
- [Zod](https://zod.dev/): Declaración y validación de esquemas.
- [Render](https://render.com/): Servicio de hosting para despliegue.
- [StandardJS](https://standardjs.com/): Guía de estilo, linter y formateador de JavaScript.
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client): Extensión de Visual Studio Code para realizar y probar solicitudes HTTP.
- [JSON Web Tokens](https://jwt.io/): Para autenticación y control de acceso basado en roles.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Para el hash, salteo y verificación de contraseñas.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): Middleware para analizar cookies en solicitudes HTTP.
- [Morgan](https://www.npmjs.com/package/morgan): Middleware para registrar solicitudes HTTP en Node.js.
- [dotenv](https://www.npmjs.com/package/dotenv): Carga variables de entorno desde un archivo `.env`.
- [cors](https://www.npmjs.com/package/cors): Middleware para habilitar CORS (Intercambio de Recursos de Origen Cruzado) en aplicaciones web.
- [nodemon](https://nodemon.io/): Herramienta que reinicia automáticamente una aplicación de Node.js cuando detecta cambios en los archivos.

## Escalabilidad Futura

Este proyecto ha sido diseñado y arquitecturado pensando en su escalabilidad, preparado para integrar futuras funcionalidades como:

- Gestión de sobreturnos
- Estados adicionales para los turnos (cancelados, reprogramados, etc.)
- Manejo de fotocopias de DNIs.
- Panel de administración avanzado

La estructura modular del proyecto facilita la incorporación de estas y otras características, manteniendo un código organizado y mantenible.
