# Welcome to our project / Bienvenido a nuestro proyecto

- [🇪🇸 Leer en español](README_es.md)

# Clinic Appointment Scheduler - Laboratory 2

Repository containing the source code for the Clinic Appointment Scheduler project, part of the "Laboratory 2" course in the "University Technical Degree in Software Development" program at [Universidad de la Punta](https://www.ulp.edu.ar/) in San Luis, Argentina.

## Team Members

- [Angel Emanuel](https://github.com/EmanuelAngel)
- [Alcaraz Rodrigo Nicolás](https://github.com/RodrigoNAlcaraz)

## Recommendations

- **Node.js** Version used in the project: v20.14. [Recommended LTS Version](https://nodejs.org/en/download/prebuilt-installer)

## Description

- Create, list, edit, activate, and deactivate patients.
- Create, list, edit, activate, and deactivate professionals (doctors).
- Create, list, edit, activate, and deactivate specialties.
- List schedules.
- Assign an appointment to a patient in an available time slot of a schedule.

## Details

- A patient can have none or multiple health insurance plans.
- A professional can have one or more specialties.
- Each schedule corresponds to a registration in a professional's specialty.
- Schedules can include appointments on different days, both morning and afternoon.
- Schedule time slots can be fragmented, allowing unavailable time slots on the same day.

## Instructions to Run the Project Locally

1. Clone the repository:

```bash
git clone https://github.com/EmanuelAngel/lab-2.git
```

2. Navigate to the cloned folder:

```bash
cd lab-2
```

3. Install dependencies:

```bash
npm|yarn|pnpm install
```

4. Download the database copy and import it into a MySQL manager.

5. Create a `.env` file and modify the environment variables according to your setup:

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

6. Start the server:

```bash
npm|yarn|pnpm run dev
```

## Project Structure

```bash
.
├── public/                 # Static files (CSS, JS)
├── views/                  # Dynamic views in Pug
├── src/                    # Main source code
│   ├── .bin/               # Entry point - Server
│   ├── config/             # Database configuration
│   ├── middlewares/        # Application middlewares
│   ├── migrations/         # Database change history
│   ├── apps/               # Application modules
│   │   ├── agenda_base/    # Schedule module
│   │   │   ├── agenda_base.http   # HTTP request testing
│   │   │   ├── controller.js
│   │   │   ├── router.js
│   │   │   ├── model.js
│   │   │   └── schema.js          # Validation schemas
│   │   ├── pacientes/      # Patients module
│   │   ├── profesionales/  # Professionals module
│   │   └── ...             # Other modules
│   └── app.js              # Main application configuration
├── package.json
├── db.copy.sql             # Latest database version
└── .env                    # Environment variables
```

## Technologies Used

- **Express**: Node.js Framework. [v4.19.0](https://expressjs.com/).
- **MySQL**: Relational database management system. [v8.0](https://www.mysql.com/) - Used for persistent storage of patients, professionals, schedules, appointments, and health insurance data.
- **Pug**: Template engine for Node.js that allows for elegant and concise HTML code. [v3.0.2](https://pugjs.org/) - Used to generate dynamic views.
- **Bootstrap y Bootstrap Icons**: UI components. [v5.3.0](https://getbootstrap.com/).
- **Zod**: Validations and schemas. [Zod](https://zod.dev/)
- **Render**: Hosting service for deploying the [server](https://render.com/).
- **StandardJS**: JavaScript style guide, linter, and formatter. [StandardJS](https://standardjs.com/).
- **REST Client**: Tool for making and testing HTTP requests. [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Future Scalability

This project has been designed and architected with scalability in mind, ready to integrate future functionalities such as:

- User authentication and authorization system.
- Management of overbooked appointments.
- Additional appointment states (canceled, rescheduled, etc.).
- Handling photocopies of ID documents.
- Advanced administration panel.

The modular structure of the project facilitates the incorporation of these and other features while maintaining organized and maintainable code.
