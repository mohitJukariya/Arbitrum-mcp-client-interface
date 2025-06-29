import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiHealthCheck() {
  const [status, setStatus] = useState<string>("Not tested");
  const [details, setDetails] = useState<string>("");
  const [testing, setTesting] = useState(false);

  const testApi = async () => {
    setTesting(true);
    setStatus("Testing...");
    setDetails("");

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      console.log("Base API URL:", baseUrl);

      // Test health endpoint only
      const endpoints = [
        {
          name: "Health Check",
          url: `${baseUrl.replace("/api", "")}/health`,
          method: "GET",
        },
      ];

      let results = "";

      for (const endpoint of endpoints) {
        results += `Testing ${endpoint.name}:\nURL: ${endpoint.url}\n`;

        try {
          const requestOptions: RequestInit = {
            method: endpoint.method,
            headers: {
              "Content-Type": "application/json",
            },
          };

          const response = await fetch(endpoint.url, requestOptions);

          results += `Status: ${response.status}\n`;

          if (response.ok) {
            const data = await response.json();
            results += `✅ SUCCESS\nResponse: ${JSON.stringify(
              data,
              null,
              2
            )}\n\n`;
            setStatus(`✅ ${endpoint.name} Working`);
            break;
          } else {
            const errorText = await response.text();
            results += `❌ Failed: ${errorText}\n\n`;
          }
        } catch (err) {
          results += `❌ Error: ${
            err instanceof Error ? err.message : "Unknown error"
          }\n\n`;
        }
      }

      if (!results.includes("✅ SUCCESS")) {
        setStatus("❌ All Endpoints Failed");
      }

      setDetails(results);
    } catch (error) {
      setStatus("❌ Network Error");
      setDetails(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>API Health Check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p>
            <strong>API URL:</strong> {import.meta.env.VITE_API_BASE_URL}/health
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>
        </div>

        <Button onClick={testApi} disabled={testing}>
          {testing ? "Testing..." : "Test API Connection"}
        </Button>

        {details && (
          <div className="bg-gray-100 p-3 rounded text-sm">
            <pre style={{ color: "#000", whiteSpace: "pre-wrap" }}>
              {details}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
