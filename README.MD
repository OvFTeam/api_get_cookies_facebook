# API Documentation 📚

This document provides comprehensive instructions on how to utilize the API provided by the application. 🚀

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

**Endpoint:** GET `/check`

**Description**: This endpoint is used to check the status of a Facebook account. 📲

- **Query Parameters**:

  - `username`: Facebook username/email
  - `password`: Facebook password
  - `ip` (optional): Proxy IP address
  - `port` (optional): Proxy port
  - `usernameProxy` (optional): Proxy username
  - `passwordProxy` (optional): Proxy password

- **Example Request:**

    ```bash
    GET /check?username=johndoe&password=pa55w0rd&ip=127.0.0.1&port=8080&usernameProxy=proxyuser&passwordProxy=proxypassword
    ```

Response:

- 200 OK ✅:

    ```json
    {
        "status": "2FA is not enabled",
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

**Endpoint:** GET `/code`

**Description:** This endpoint is used to enter the verification code for two-factor authentication. 🔐

- **Query Parameters**:
  - `code` (string): The code to enter.

- **Example Request**:

    ```bash
    GET /code?code=123456
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
