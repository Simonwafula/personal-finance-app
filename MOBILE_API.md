# Mobile API Contract

This document defines the minimal API contract for mobile ↔ web sync so mobile and web can be implemented in parallel.

## Auth
- Mobile: use token auth (recommended). The server currently uses session auth for web; mobile should use an API token (JWT or DRF token). Include token in `Authorization: Token <token>` or `Authorization: Bearer <jwt>` header.

## Endpoints

### POST /api/transactions/sync/
- Purpose: Client sends a batch of transaction items to create or update on the server. Server returns per-item results.
- Request JSON schema:

```json
{
  "items": [
    {
      "external_id": "string (optional)",
      "client_id": "string (optional, client-side stable id)",
      "date": "YYYY-MM-DD",
      "amount": number,
      "kind": "INCOME|EXPENSE",
      "description": "string (optional)",
      "category": integer (category id, optional),
      "account": integer (account id, optional),
      "from_account": integer (optional),
      "to_account": integer (optional),
      "tags": [integer],
      "updated_at": "ISO-8601 timestamp (optional, client last-modified)",
      "deleted": boolean (optional)
    }
  ]
}
```

- Response JSON schema:

```json
{
  "results": [
    {
      "external_id": "string or null",
      "id": integer (server internal id if created/found),
      "created": boolean,
      "error": "string (optional)"
    }
  ]
}
```

Notes on current server behavior (implementation present in `finance.views.TransactionViewSet.sync`):
- If `external_id` is provided the server uses `update_or_create(user, external_id=..., defaults=...)`.
- If no `external_id` the server attempts to deduplicate using `(date, amount, description)` tuple.
- Per-item errors are returned inline as result entries.

## Conflict resolution (recommended contract)
- Recommended: client include `external_id` for each logical transaction. `external_id` must be stable and globally unique per logical item.
- Add `updated_at` (client last-modified) in payload. Server should compare `updated_at` with server `updated_at`:
  - If client's `updated_at` <= server `updated_at`, server should ignore the update and return the existing `id` with `created:false`.
  - If client's `updated_at` > server `updated_at`, server should apply the update and set server `updated_at` to now (or provided timestamp).
- If no `updated_at` available, server falls back to last-write-wins (server currently overwrites on update_or_create).

## Idempotency and retries
- Clients must resend the same `external_id` for retries of the same logical transaction so the server can deduplicate.
- For create-only flows, client may omit `external_id` but risk duplicates; avoid when possible.

## Deletions
- Recommended: support `deleted: true` on an item to mark it deleted. Server should soft-delete (set `is_deleted` or a flag) or remove the row and return success. Current implementation does not handle deletions — server will ignore `deleted` unless extended.

## Client `external_id` generation guidance
- Use a stable scheme per device/user, e.g. `sha256(user_id + device_id + local_id + created_at)` or `device-UUID:local-counter` or a UUIDv4 created when the item is first created offline.
- Ensure collision resistance across devices.

## Error handling
- Response contains per-item `error` strings for failures. Clients should surface these to the user and optionally retry after fixes.

## Examples

- Create new transaction (client generates `external_id`):

```json
POST /api/transactions/sync/
{
  "items": [
    {
      "external_id": "device123-0001",
      "date": "2026-01-03",
      "amount": 1500.00,
      "kind": "EXPENSE",
      "description": "MPESA withdrawal",
      "account": 12,
      "category": 5,
      "updated_at": "2026-01-03T09:12:00Z"
    }
  ]
}
```

Response:

```json
{
  "results": [ { "external_id": "device123-0001", "id": 424, "created": true } ]
}
```

- Update existing transaction (client resends same `external_id` with changed fields and later `updated_at`):

```json
{
  "items": [
    {
      "external_id": "device123-0001",
      "date": "2026-01-03",
      "amount": 1400.00,
      "description": "MPESA withdrawal (corrected)",
      "updated_at": "2026-01-03T10:15:00Z"
    }
  ]
}
```

Response:

```json
{ "results": [ { "external_id": "device123-0001", "id": 424, "created": false } ] }
```

## Migration and deploy notes
- `finance/migrations/0002_add_double_entry.py` was added; run `python manage.py migrate` on the server before deploying the mobile-enabled clients.

## Next server improvements (recommended)
- Add `updated_at`/`version` comparisons in `sync` handler to avoid overwriting newer server state.
- Support `deleted` flag for client-initiated deletions.
- Add dedicated endpoints for syncing `accounts`, `categories`, and `tags`.
- Provide token-based auth for mobile and rotate tokens securely.

---
Commit this file to the repo so mobile and web teams can implement to the same contract.
