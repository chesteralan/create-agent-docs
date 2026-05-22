# API Contracts — my-nextjs-app

This document details the communication contracts, response models, and conventions for interacting with the **my-nextjs-app** backends.

---

## 🌐 Endpoint Protocols

- **Base URL (Local)**: `http://localhost:3000`
- **Format**: All payloads must be structured as `application/json`.
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN>` (For authenticated requests)

---

## 🔒 Error Payload Structure

All API error responses must adhere to the following payload contract:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable error explanation.",
    "details": {}
  }
}
```

---

## 📝 Integration Guidelines

> [!NOTE]
> ### 1. Client Requests
> All client operations should wrap API fetches in try/catch handlers, mapping raw errors to user-friendly messages.
>
> ### 2. Cors Policies
> Allow origins must be restricted to standard local hosts during development, and explicit production domains on deployment.
