# passphrase-forge MCP Server

The passphrase-forge app exposes a remote MCP (Model Context Protocol) server at `/api/mcp`. This lets you generate passphrases directly from any AI assistant that supports MCP — no local installation required.

## Tool

### `generate_passphrase`

Generates a secure Finnish passphrase using the same defaults as the web UI:

- 3 random words
- 1 digit (1–9)
- Hyphen separator
- Finnish umlauts stripped (ä→a, ö→o)

**No parameters required.** Just call the tool.

**Example output:** `koira-talo-4-auto`

## Installation

### Claude Desktop

Add the following to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "passphrase-forge": {
      "type": "http",
      "url": "https://your-domain.com/api/mcp"
    }
  }
}
```

Restart Claude Desktop after saving.

### Claude Code

Run the following command in your terminal:

```bash
claude mcp add --transport http passphrase-forge https://your-domain.com/api/mcp
```

Or add it via the Claude Code settings UI under **MCP Servers**.

### Other MCP clients

Use the URL `https://your-domain.com/api/mcp` with HTTP (Streamable HTTP) transport.

## Usage

Once configured, ask your AI assistant to generate a passphrase:

- "Generate a passphrase for me"
- "I need a secure password, use passphrase-forge"
- "Create a passphrase using the passphrase tool"

## Local development

To test against a locally running instance, use `http://localhost:3000/api/mcp` as the URL after starting the dev server with `npm run dev`.
