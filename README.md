# URL Shortener

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

</p> <p align="center"> A REST API built with <strong>NestJS</strong> for shortening URLs. It includes user authentication, access tracking, and link management. Supports creation, listing, updating, and logical deletion of URLs, with a focus on scalability and security. </p>

---

## Technologies and Features

- **Node.js**
- **NestJS** (TypeScript)
- **Helmet**
- **CORS**
- **HPP**
- **@nestjs/throttler**
- **class-validator / class-transformer**
- **compression**
- **Winston**
- **Swagger**

## Main Endpoints

```http
GET /docs — Access the API documentation
```

(Endpoints will be expanded as the project evolves)

## Security

- Helmet with custom CSP policies to restrict content sources and prevent XSS attacks
- Additional security headers: X-Content-Type-Options: nosniff, Referrer-Policy: no-referrer, Frameguard: deny, and others
- Payload size limit of 1MB for JSON and URL-encoded bodies to prevent DoS attacks
- Input validation with whitelist and forbidden non-whitelisted properties using global ValidationPipe
- Rate limiting set to 100 requests per IP every 60 seconds
- Protection against HTTP Parameter Pollution (HPP)
- CORS restricted to the domain defined in the `BASE_URL` environment variable
- X-Powered-By header disabled to avoid exposing the tech stack

## Validation

- Automated input validation using `class-validator`.
- Custom and clear error responses through a global `ValidationPipe`
- Automatic data transformation to expected types

## Logging and Error Handling

- Custom logger with Winston
- Replaces NestJS `LoggerService` with Winston to capture all logs
- Global exception logging through `AllExceptionsFilter`

## Optimization and Performance

- HTTP response compression using `compression` middleware
- Modular structure with efficient module loading
- Global exception handling for consistency

## Documentation with Swagger

- The API is fully documented using Swagger (OpenAPI).

Accessible at:

```http
GET /api/docs
```

## Requirements

- **Node.js** version 22.17.1
- This project includes a `.nvmrc` file to ease Node version management with NVM
- It is recommended to use [NVM](https://github.com/nvm-sh/nvm)

To activate the correct Node version:

```bash
nvm use
```

## Environment Variables

To run this project, you need the following variables in your `.env` file:

`PORT`
`BASE_URL`
`DATABASE_URL`

## Author

- Paulo Silva — Back-End Developer
  [LinkedIn](https://www.linkedin.com/in/paulors1206) | [GitHub](https://github.com/prsonda)

## License © 2025 Paulo Silva

- This project was developed exclusively for technical evaluation purposes
- Any commercial use, redistribution, or modification without the author's explicit permission is prohibited
