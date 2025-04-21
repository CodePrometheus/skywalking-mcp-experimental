/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import graphql from "./graphql/client.js";
import { TraceSpan } from "./graphql/queries.js";
import { AxiosResponse } from "axios";

interface GraphQLResponse {
  data?: {
    queryTrace?: {
      spans: TraceSpan[];
    };
  };
  errors?: string;
}

// Create MCP server instance
const server = new McpServer({
  name: "skywalking-mcp",
  version: "0.1.0",
});

// Add a simple test resource
server.resource("metrics", "metrics://test", async (uri) => ({
  contents: [
    {
      uri: uri.href,
      text: "Test metrics data",
    },
  ],
}));

// Add query tool
server.tool(
  "query-trace",
  {
    traceId: z.string(),
  },
  async ({ traceId }) => {
    try {
      const response = (await graphql
        .query("queryTrace")
        .params({ traceId })) as unknown as AxiosResponse<GraphQLResponse>;
      if (response.data.errors) {
        return {
          content: [
            {
              type: "text",
              text: `Error querying trace: ${response.data.errors}`,
            },
          ],
          isError: true,
        };
      }
      if (!response.data.data?.queryTrace?.spans) {
        return {
          content: [
            {
              type: "text",
              text: "No trace data found",
            },
          ],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data.data.queryTrace.spans, null, 2),
          },
        ],
      };
    } catch (error) {
      const err = error as Error;
      return {
        content: [
          {
            type: "text",
            text: `Error querying trace: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Start server
const transport = new StdioServerTransport();
server
  .connect(transport)
  .then(() => {
    console.log("SkyWalking MCP server started");
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
