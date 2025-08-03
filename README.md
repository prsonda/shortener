# URL Shortener

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

</p> <p align="center"> REST API for shortening URLs, with authentication, click tracking, and advanced security</p>

---

## Technologies and Features

- **Node.js**
- **NestJS** (TypeScript)
- **Prisma** (ORM with PostgreSQL)
- **PostgreSQL 16**
- **JWT Authentication**
- **Swagger** (OpenAPI Documentation)
- **Helmet** (Protection against malicious headers)
- **CORS** (Configured via BASE_URL)
- **HPP** (Protection against parameter pollution)
- **@nestjs/throttler** (Rate Limiting by IP)
- **class-validator / class-transformer** (DTO validation and transformation)
- **compression** (HTTP response compression)
- **Winston** (Custom logger)
- **ESLint / Prettier** (Code standardization and lint)
- **Jest** (Test coverage)
- **Husky / Commitlint** (Commit validation)
- **standard-version** (Semantic versioning)
- **Docker / Docker Compose** (Containerization and orchestration)

---

## Design and Scalability

- The single endpoint for shortening accepts both authenticated and unauthenticated requests, associating URLs with users when authenticated.
- Authenticated users can list URLs with click counts and manage their own links.
- URL deletion is logical, using the deletedAt field to mark records without physical removal.
- Logging is done via Winston, prepared for future addition of metrics and tracing.
- Pre-commit hooks, linting, and unit tests ensure code quality and consistency.
- Modular domain structure promotes independent maintenance and easier evolution, supporting scalability.
- Clear separation of layers (application, domain, infrastructure, presentation) reduces coupling and improves testability.
- The design enables potential future migration to microservices.

---

## Endpoints

```http
GET /docs                          — Access the API documentation
GET /version                       — Get current API version
POST /auth/login                   — Authenticate and receive a JWT token
POST /user                         — Create a new user (returns JWT)
GET /user/:id                      — Get user data (requires JWT)
POST /shortener                    — Create a new shortened URL (auth optional)
GET /shortener/:shortCode          — Retrieve a shortened URL (requires JWT)
GET /shortener                     — List user's shortened URLs (requires JWT)
PATCH /shortener/:shortCode        — Update a shortened URL (requires JWT)
PATCH /shortener/:shortCode/delete — Soft-delete a URL (requires JWT)
GET /:shortCode                    — Redirect to the original URL (public)
```

## Security

- Helmet with custom CSP policies to restrict content sources and prevent XSS attacks.
- Additional security headers: X-Content-Type-Options: nosniff, Referrer-Policy: no-referrer, Frameguard: deny, and others.
- Payload size limit of 1MB for JSON and URL-encoded bodies to prevent DoS attacks.
- Input validation with whitelist and forbidden non-whitelisted properties using global ValidationPipe.
- Rate limiting set to 100 requests per IP every 60 seconds.
- Protection against HTTP Parameter Pollution (HPP).
- CORS restricted to the domain defined in the `BASE_URL` environment variable.
- X-Powered-By header disabled to avoid exposing the tech stack.

## Validation

- Automated input validation using `class-validator`.
- Custom and clear error responses through a global `ValidationPipe`.
- Automatic data transformation to expected types.

## Logging and Error Handling

- Custom logger with Winston.
- Replaces NestJS `LoggerService` with Winston to capture all logs.
- Global exception logging through `AllExceptionsFilter`.

## Optimization and Performance

- HTTP response compression using `compression` middleware.
- Modular structure with efficient module loading.
- Global exception handling for consistency.

## Documentation with Swagger

- The API is fully documented using Swagger (OpenAPI).

Accessible at:

```http
GET /docs
```

## Environment Variables

To run this project, you need the following variables in your `.env` file:

```env
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname
DATABASE_URL=postgresql://postgres:password@db:5432/dbname
JWT_SECRET=jwtsecret
JWT_EXPIRES_IN=1h
```

The above variables are just examples, please change according to your actual environment, passwords must be kept secure and never versioned.

## Running with Docker

Docker and docker-compose must be installed.

1. Create the `.env` file in the project root with the variables listed above.

2. Build the images and upload the containers:

```bash
docker-compose up --build
```

The app container waits for the database to be ready before starting, automatically applies migrations, and runs the application.

3. The app will be available on the port defined in PORT (e.g., http://localhost:3000).

4. To stop and remove containers:

```bash
docker-compose down
```

## Requirements to run locally

1. **Node.js** version 22.17.1

- This project includes a `.nvmrc` file to ease Node version management with NVM.
- It is recommended to use [NVM](https://github.com/nvm-sh/nvm).

To activate the correct Node version:

```bash
nvm use
```

2. PostgresSQL version 16.
3. Clone the repository and enter the project folder.
4. Create the .env file with the necessary environment variables (see Environment Variables section).
5. Install the dependencies:

```bash
yarn install
```

6. Generate the Prisma client and run the migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

7. To run in development mode:

```bash
yarn start:dev
```

8. To run in production mode:

```bash
yarn build
yarn start
```

## Author

- Paulo Silva — Back-End Developer
  [LinkedIn](https://www.linkedin.com/in/paulors1206) | [GitHub](https://github.com/prsonda)

## License © 2025 Paulo Silva

- This project was developed exclusively for technical evaluation purposes
- Any commercial use, redistribution, or modification without the author's explicit permission is prohibited
