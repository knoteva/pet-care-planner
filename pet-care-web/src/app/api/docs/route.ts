import { apiEndpoints } from "@/services/mock-data";

export const dynamic = "force-static";

export function GET() {
  const rows = apiEndpoints
    .map(
      (endpoint) => `
        <tr>
          <td><span class="method">${endpoint.method}</span></td>
          <td><code>${endpoint.path}</code></td>
          <td>${endpoint.purpose}</td>
        </tr>
      `,
    )
    .join("");

  return new Response(
    `<!doctype html>
      <html lang="bg">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Pet Care Planner API Docs</title>
          <style>
            body {
              margin: 0;
              background: #f5f7f4;
              color: #171717;
              font-family: Arial, Helvetica, sans-serif;
            }
            main {
              max-width: 960px;
              margin: 0 auto;
              padding: 32px 18px;
            }
            header,
            table {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: white;
            }
            header {
              padding: 24px;
              margin-bottom: 18px;
            }
            h1 {
              margin: 0;
              font-size: 30px;
            }
            p {
              color: #525252;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              overflow: hidden;
            }
            th,
            td {
              padding: 14px;
              border-bottom: 1px solid #f0f0f0;
              text-align: left;
              vertical-align: top;
              font-size: 14px;
            }
            th {
              background: #ecfdf5;
              color: #065f46;
              font-size: 12px;
              text-transform: uppercase;
            }
            tr:last-child td {
              border-bottom: 0;
            }
            code {
              font-family: "Courier New", Courier, monospace;
            }
            .method {
              display: inline-block;
              border: 1px solid #bbf7d0;
              border-radius: 8px;
              background: #ecfdf5;
              color: #166534;
              padding: 5px 9px;
              font-weight: 700;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <main>
            <header>
              <h1>Pet Care Planner API Docs</h1>
              <p>
                API reference for the implemented and planned REST endpoints. Auth routes already return Bearer JWT tokens for mobile clients and set the Web session cookie for browser users.
              </p>
            </header>
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </main>
        </body>
      </html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}
