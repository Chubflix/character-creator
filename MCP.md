# MCP Server Setup Guide

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI assistants (like Claude) to securely access your application data. This Character Creator includes an MCP server that allows Claude or other AI tools to read your character sheets and chat history.

## MCP Server Endpoints

Your MCP server is available at: `https://your-domain.com/api/mcp`

### Available Methods

1. **`characters/list`** - List all your characters
2. **`characters/get`** - Get details of a specific character
3. **`characters/export`** - Export a character in TavernAI/ChubAI format
4. **`chat/history`** - Get chat history for a character

## Setting Up MCP with Claude Desktop

### Prerequisites

- Your Chubflix Character Creator must be deployed (Vercel recommended)
- You need a Supabase authentication token

### Step 1: Get Your Authentication Token

1. Sign in to your Character Creator app
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run this command:
   ```javascript
   supabase.auth.getSession().then(({data}) => console.log(data.session.access_token))
   ```
5. Copy the token that appears

### Step 2: Configure Claude Desktop

1. Open Claude Desktop settings
2. Navigate to the "Developer" or "MCP Servers" section
3. Add a new MCP server with these settings:

```json
{
  "mcpServers": {
    "character-creator": {
      "url": "https://your-app-domain.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

Replace:
- `your-app-domain.vercel.app` with your actual Vercel domain
- `YOUR_TOKEN_HERE` with the token from Step 1

### Step 3: Test the Connection

1. Restart Claude Desktop
2. Ask Claude: "List my characters from the character creator"
3. Claude should now be able to access your character data!

## Using the MCP Server

### Example Requests

Once configured, you can ask Claude questions like:

- "Show me all my characters"
- "Get the details of my character named [Name]"
- "Export my character [Name] in TavernAI format"
- "Show me the chat history for character [ID]"

### Manual API Testing

You can also test the MCP server directly using curl:

```bash
# List characters
curl -X POST https://your-domain.com/api/mcp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "characters/list"
  }'

# Get specific character
curl -X POST https://your-domain.com/api/mcp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "characters/get",
    "params": {
      "characterId": "CHAR_UUID_HERE"
    }
  }'

# Export character
curl -X POST https://your-domain.com/api/mcp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "characters/export",
    "params": {
      "characterId": "CHAR_UUID_HERE"
    }
  }'
```

## Security Notes

- **Never share your authentication token** - it provides full access to your data
- Tokens expire after 1 hour by default
- Always use HTTPS in production
- The MCP server only exposes data for the authenticated user

## Token Refresh

Authentication tokens expire. When your token expires:

1. Sign in to your app again
2. Get a new token using the DevTools method above
3. Update your Claude Desktop configuration
4. Restart Claude Desktop

## Troubleshooting

### "Authentication required" error
- Your token may have expired - get a new one
- Check that you included `Bearer ` before the token
- Verify the Authorization header is set correctly

### "Character not found" error
- Verify the characterId exists and belongs to you
- Character IDs are UUIDs - make sure you're using the correct format

### Claude can't access my data
- Restart Claude Desktop after configuration changes
- Check that your app is deployed and accessible
- Verify the URL in the configuration matches your deployment

## Production Deployment

When deploying to Vercel:

1. Ensure all environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` or `OPENROUTER_API_KEY`

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Your MCP server will be available at:
   ```
   https://your-project.vercel.app/api/mcp
   ```

## Advanced: Building MCP Clients

If you want to build custom tools that use the MCP server:

```typescript
// Example MCP client
async function listCharacters(token: string) {
  const response = await fetch('https://your-domain.com/api/mcp', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'characters/list'
    })
  });
  
  const data = await response.json();
  return data.result.characters;
}
```

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Claude Desktop MCP Setup](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
