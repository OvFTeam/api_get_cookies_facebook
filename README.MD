# API Documentation 📚

This document outlines the usage of the API provided by the application. 🚀

## Installation and Setup ⚙️

1. Clone the repository:

    ```bash
    git clone https://github.com/ovfteam/api_get_cookies_facebook.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the server:

    ```bash
    npm start
    ```

## Endpoints 📍

### 1. Check Account Status ✅

**Endpoint:** POST `/check`

**Description**: Checks the status of a Facebook account. 📲

Request Body:

```json
{
    "username": "<example@example.com>",
    "password": "examplePassword",
    "ip": "proxy_ip",
    "port": "proxy_port",
    "usernameProxy": "proxy_username",
    "passwordProxy": "proxy_password"
}
```

Response:

- 200 OK ✅:

    ```json
    {
        "status": "Không bật 2FA",
        "cookies": ["cookie1", "cookie2", ...]
    }
    ```

    or

    ```json
    {
        "status": "status_message"
    }
    ```

- 500 Internal Server Error ❌:

    ```json
    {
        "error": "error_message"
    }
    ```

### 2. Enter Verification Code ✉️

**Endpoint:** POST `/code`

**Description:** Enters the verification code for two-factor authentication. 🔐

Request Body:

```json
{
    "code": "verification_code"
}
```

Response:

- 200 OK ✅:

    ```json
    {
        "status": "status_message",
        "cookies": ["cookie1", "cookie2", ...]
    }
    ```

- 500 Internal Server Error ❌:

    ```json
    {
        "error": "error_message"
    }
    ```
