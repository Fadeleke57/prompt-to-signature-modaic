"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { environment } from "@/lib/environment";
import { Switch } from "@/components/ui/switch";
import { Loader2, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import Link from "next/link";

const promptPlaceholder = `You are analyzing customer reviews for a restaurant. Given a review text, classify the sentiment into one of three categories:

Positive: Customer had a good experience
Negative: Customer had a bad experience
Neutral: Mixed feelings or factual statement without clear sentiment

Examples:

1. "Amazing food and excellent service! Will definitely come back." → Positive
2. "The pasta was cold and the waiter was rude." → Negative
3. "The restaurant is located downtown. They serve Italian food." → Neutral
`;

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [view, setView] = useState<"code" | "info">("code");
  const [refine, setRefine] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedCode("");

    try {
      const response = await fetch(environment.api_url + "/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          refine: refine,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Extract the actual code from the response
      const code =
        typeof data === "string"
          ? data
          : data.code || data.signature || JSON.stringify(data, null, 2);
      setGeneratedCode(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <div className="w-full h-20 border-b-2 border-black justify-between items-center flex px-16">
        <div className="font-semibold font-press-start-2p">sgntrs.dev</div>
        <div className="flex items-center gap-4">
          <Button
            variant={view === "code" ? "secondary" : "ghost"}
            onClick={() => setView("code")}
            className={cn("cursor-pointer text-md transition-all")}
          >
            Code
          </Button>
          <Button
            variant={view === "info" ? "secondary" : "ghost"}
            onClick={() => setView("info")}
            className={cn("cursor-pointer text-md transition-all")}
          >
            Learn about Signatures
          </Button>
        </div>
        <div className="font-semibold font-press-start-2p">
          <Link href={"https://modaic.dev/"} target="_blank">
            Modaic
          </Link>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl tracking-tightest font-press-start-2p">
              Prompt to Signature
            </h1>
            <p className="text-muted-foreground font-medium">
              Convert lossy, static prompts into structured DSPy signatures
            </p>
          </div>

          <Card className="rounded-sm border-b-2">
            <CardHeader>
              <CardTitle>Enter Your Prompt</CardTitle>
              <CardDescription>
                Aim to be as descriptive as possible, if your signature is
                lacking it&apos;s likely because your prompt is too!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={promptPlaceholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 max-h-64"
              />

              <div className="flex items-center justify-end">
                {/*<div className="flex items-center gap-2">
                  <Switch
                    id="refine"
                    checked={refine}
                    onCheckedChange={setRefine}
                  />
                  <label
                    htmlFor="refine"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Interactive Mode
                  </label>
                </div>*/}

                <Button
                  onClick={handleSubmit}
                  variant={"secondary"}
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  {loading ? "Generating..." : "Generate Signature"}
                </Button>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {generatedCode && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Generated Code</CardTitle>
                    <CardDescription>
                      Your DSPy signature is ready
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1.5rem",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                      background: "#1e1e1e",
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                  >
                    {generatedCode}
                  </SyntaxHighlighter>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="w-full h-20 justify-between items-center border-t-2 border-black flex px-16">
        <div className="font-semibold font-press-start-2p">sgntrs.dev</div>
        <div className="flex items-center gap-1 font-medium text-gray-600">
          <Link href={"https://modaic.dev/"} target="_blank">
            <Button variant={"link"} className="cursor-pointer text-gray-600">
              Modaic
            </Button>
          </Link>

          <Link href={"https://dspy.ai/"} target="_blank">
            <Button variant={"link"} className="cursor-pointer text-gray-600">
              DSPy Docs
            </Button>
          </Link>

          <Link href={"https://discord.gg/5NZ3GZNq5k"} target="_blank">
            <Button variant={"link"} className="cursor-pointer text-gray-600">
              Discord
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
