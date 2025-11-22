# MCP Server Implementation

## Overview
The MCP (Model Context Protocol) server exposes character data through an authenticated API endpoint hosted on Vercel.

## Endpoint
`/api/mcp`

## Authentication
Uses Supabase authentication with Bearer token:
```
Authorization: Bearer <supabase-access-token>
```

## Supported Methods

### characters/list
List all characters for authenticated user
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "characters/list"
}
```

### characters/get
Get specific character details
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "characters/get",
  "params": { "characterId": "uuid" }
}
```

### characters/export
Export character as TavernAI/ChubAI JSON
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "characters/export",
  "params": { "characterId": "uuid" }
}
```

### chat/history
Get chat history for a character
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "chat/history",
  "params": {
    "characterId": "uuid",
    "sessionId": "uuid" // optional
  }
}
```

## Response Format
JSON-RPC 2.0 standard format:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { ... }
}
```

## Error Codes
- `-32001`: Authentication required
- `-32600`: Invalid Request
- `-32603`: Internal error
- `-32700`: Parse error

## Deployment
The MCP server runs on Vercel as a serverless API route and requires Supabase configuration.
