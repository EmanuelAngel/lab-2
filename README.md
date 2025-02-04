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

- Sign up, log in, and log out.
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
- Secure access to the application based on user roles (e.g., admin, professional, patient).

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
│   │   ├── auth/           # Authentication and authorization module
│   │   ├── pacientes/      # Patients module
│   │   ├── profesionales/  # Professionals module
│   │   └── ...             # Other modules
│   └── app.js              # Main application configuration
├── package.json
├── db.copy.sql             # Latest database version
└── .env                    # Environment variables
```

## Technologies Used

- [Express v4.19.0](https://expressjs.com/): Node.js Framework.
- [MySQL v8.0](https://www.mysql.com/): Relational database management system. - Used for persistent storage of patients, professionals, schedules, appointments, and health insurance data.
- [Pug](https://pugjs.org/): Template engine for Node.js - Used to generate dynamic views.
- [Bootstrap](https://getbootstrap.com/): Feature-packed frontend toolkit.
- [Bootstrap Icons](https://icons.getbootstrap.com/): Icons for Bootstrap
- [Zod](https://zod.dev/): Schema declaration and validation library.
- [Render](https://render.com/): Hosting service for deployment.
- [StandardJS](https://standardjs.com/): JavaScript style guide, linter, and formatter.
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client): Visual Studio Code Extension tool for making and testing HTTP requests.
- [JSON Web Tokens](https://jwt.io/): For authentication and role-based access control.
- [bcrypt](https://www.npmjs.com/package/bcrypt): For hashing, salting, and verifying passwords.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): Middleware for parsing cookies in HTTP requests.
- [morgan](https://www.npmjs.com/package/morgan): Middleware for logging HTTP requests in Node.js.
- [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file.
- [cors](https://www.npmjs.com/package/cors): Middleware to enable CORS (Cross-Origin Resource Sharing) in web applications.
- [nodemon](https://nodemon.io/): Tool that automatically restarts a Node.js application when file changes are detected.

## Future Scalability

This project has been designed and architected with scalability in mind, ready to integrate future functionalities such as:

- Management of overbooked appointments.
- Additional appointment states (canceled, rescheduled, etc.).
- Handling photocopies of ID documents.
- Advanced administration panel.

The modular structure of the project facilitates the incorporation of these and other features while maintaining organized and maintainable code.
