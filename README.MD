# API Readme

## Overview

This API provides functionality to check the status of a Facebook account using provided credentials (username, password, and optional code for two-factor authentication). It utilizes Flask for the web framework and Selenium for web automation to interact with the Facebook login page.

## Endpoints

### GET /check_facebook_status

- **Description:** Checks the status of a Facebook account.
- **Query Parameters:**
  - **username:** Facebook username.
  - **password:** Facebook password.
  - **code:** (Optional) Two-factor authentication code.
- **Response:**
  - JSON object containing:
    - status: Status of the Facebook account (e.g., "Sai mat khau", "Checkpoint", "2FA").
    - cookies: Cookies (if any), returned as a list of dictionaries.

## Example

### Request

```bash
curl -X GET "http://gombiztank.id.vn/check_facebook_status?username=myusername&password=mypassword&code=mycode"
```

```json
{
  "status": "Sai mat khau",
  "cookies": null
}
```
