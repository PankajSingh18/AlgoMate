# AlgoBuddy Backend

This is the Spring Boot-based REST API backend for AlgoBuddy.

## CORS Configuration

The backend features a secure, parsed, and validated CORS allowlist configured through properties and environment variables.

### Configuration Properties

You can customize the CORS settings using the following properties:

| Property | Environment Variable | Default Value | Description |
|---|---|---|---|
| `app.allowed-origins` | `ALLOWED_ORIGINS` | *Empty* | A comma-separated list of allowed origins (e.g., `http://localhost:3000,https://algobuddy.me`). |
| `app.environment` | `APP_ENV` | `dev` | The active application environment (e.g., `dev`, `prod`, `production`). Defaults to `spring.profiles.active` if set. |

### Security & Validation Rules

To protect the API against cross-origin security bypasses, the backend applies the following validation rules to configured origins:

1. **No Wildcards:** Wildcard characters (`*`) are disallowed to prevent open access. If found in the configuration, they are ignored.
2. **Scheme Enforcement:** Origins must explicitly start with `http://` or `https://`. Other schemes (e.g., `ftp://`) or invalid URLs are skipped.
3. **Trailing Slashes:** Trailing slashes are automatically trimmed (e.g., `http://localhost:3000/` becomes `http://localhost:3000`) to correctly match standard browser `Origin` headers.
4. **Environment-Aware Fallbacks:**
   - **Development/Test (`APP_ENV=dev` or not production):** If no origins are configured, it defaults to allowing `http://localhost:3000` so that local development works out-of-the-box.
   - **Production (`APP_ENV=production` or `prod`):** If no origins are configured, it will print an error and **block all cross-origin requests** by default for safety.

---

## Building and Testing

### Prerequisites
- Java 21+
- Maven (or use the included `./mvnw` wrapper)

### Build the Application
To build the backend package:
```bash
./mvnw clean package -DskipTests
```

### Run Tests
To run CORS unit and integration tests:
```bash
./mvnw test -Dtest=CorsConfigTest,CorsIntegrationTest
```
