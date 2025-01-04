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
│   │   ├── pacientes/      # Módulo de Pacientes
│   │   ├── profesionales/  # Módulo de Profesionales
│   │   └── ...             # Otros módulos
│   └── app.js              # Configuración principal de la aplicación
├── package.json
├── db.copy.sql             # Versión más reciente de la base de datos
└── .env                    # Variables de entorno
```

## Tecnologías utilizadas

- **Express**: Framework de Node.js. [v4.19.0](https://expressjs.com/).
- **MySQL**: Sistema de gestión de base de datos relacional. [v8.0](https://www.mysql.com/) - Utilizado para el almacenamiento persistente de datos de pacientes, profesionales, agendas, turnos y obras sociales.
- **Pug**: Motor de plantillas para Node.js que permite escribir HTML de manera elegante y con menos código. [v3.0.2](https://pugjs.org/) - Empleado para generar las vistas dinámicas de la aplicación.
- **Bootstrap y Bootstrap Icons**: Componentes de UI. [v5.3.0](https://getbootstrap.com/).
- **Zod**: Validaciones y Esquemas. [Zod](https://zod.dev/)
- **Render**: Servicio de hosting para desplegar el [servidor](https://render.com/).
- **StandardJS**: Estilizador, Linter y Formateador para JavaScript. [StandardJS](https://standardjs.com/).
- **REST Client**: Para realizar y testear peticiones HTTP. [Extensión de Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Escalabilidad Futura

Este proyecto ha sido diseñado y arquitecturado pensando en su escalabilidad, preparado para integrar futuras funcionalidades como:

- Sistema de autenticación y autorización de usuarios
- Gestión de sobreturnos
- Estados adicionales para los turnos (cancelados, reprogramados, etc.)
- Manejo de fotocopias de DNIs.
- Panel de administración avanzado

La estructura modular del proyecto facilita la incorporación de estas y otras características, manteniendo un código organizado y mantenible.
