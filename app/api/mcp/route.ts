import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { getPasswordGenerator } from "@/app/passphrase/server";

export async function POST(req: Request) {
  const server = new McpServer({
    name: "passphrase-forge",
    version: "1.0.0",
  });

  server.tool(
    "generate_passphrase",
    "Generate a secure Finnish passphrase using the same defaults as the web UI (3 words, 1 digit, hyphen separator)",
    async () => {
      const generator = await getPasswordGenerator();
      const result = await generator.generateDetails({ mode: "gpt-4o" });
      return {
        content: [{ type: "text", text: result.passphrase }],
      };
    },
  );

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  return transport.handleRequest(req);
}

export const dynamic = "force-dynamic";
