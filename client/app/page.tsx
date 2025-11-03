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
import {
  medicalRecordPrompt,
  ecomProductReviewPrompt,
  legalContractClausePrompt,
  newsArticleTopicPrompt,
  customerSupportTicketPrompt,
  resumeParsingPrompt,
  financialDocumentAnalysis,
  socialMediaContentModeration,
  academicPaperClassification,
  voiceOfCustomerAnalysis,
} from "@/lib/prompts";

const promptPlaceholder = `You are analyzing customer reviews for a restaurant. Given a review text, classify the sentiment into one of three categories:

Positive: Customer had a good experience
Negative: Customer had a bad experience
Neutral: Mixed feelings or factual statement without clear sentiment

Examples:

1. "Amazing food and excellent service! Will definitely come back." → Positive
2. "The pasta was cold and the waiter was rude." → Negative
3. "The restaurant is located downtown. They serve Italian food." → Neutral
`;

const examplePrompts = [
  { name: "Medical Record Analysis", content: medicalRecordPrompt },
  { name: "E-commerce Review Analysis", content: ecomProductReviewPrompt },
  { name: "Legal Contract Analysis", content: legalContractClausePrompt },
  { name: "News Article Classification", content: newsArticleTopicPrompt },
  { name: "Support Ticket Triage", content: customerSupportTicketPrompt },
  { name: "Resume Parsing", content: resumeParsingPrompt },
  { name: "Invoice Processing", content: financialDocumentAnalysis },
  { name: "Content Moderation", content: socialMediaContentModeration },
  { name: "Academic Paper Analysis", content: academicPaperClassification },
  { name: "Customer Feedback Analysis", content: voiceOfCustomerAnalysis },
];

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
      <div className="w-full min-h-20 border-b-2 border-black justify-between items-center flex flex-wrap gap-4 px-4 sm:px-8 lg:px-16 py-4">
        <div className="font-semibold font-press-start-2p text-xs sm:text-sm">sgntrs.dev</div>
        <div className="flex items-center gap-2 sm:gap-4 order-3 sm:order-2">
          <Button
            onClick={() => setView("code")}
            className={cn(
              "cursor-pointer text-xs sm:text-sm md:text-md transition-all",
              view === "code" ? "bg-orange-400" : "bg-transparent"
            )}
          >
            Code
          </Button>
          <Button
            onClick={() => setView("info")}
            className={cn(
              "cursor-pointer text-xs sm:text-sm md:text-md transition-all whitespace-nowrap",
              view === "info" ? "bg-orange-400" : "bg-transparent"
            )}
          >
            <span className="hidden sm:inline">Learn about Signatures</span>
            <span className="sm:hidden">Signatures</span>
          </Button>
        </div>
        <div className="font-semibold font-press-start-2p text-xs sm:text-sm order-2 sm:order-3">
          <Link href={"https://modaic.dev/"} target="_blank">
            <span className="hidden sm:inline">Powered by </span><span className="text-orange-500">Modaic</span>
          </Link>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tightest font-press-start-2p">
              Prompt to Signature
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium px-4">
              Convert lossy, static prompts into structured DSPy signatures
            </p>
          </div>

          {view === "code" && (
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
                  className="min-h-60 max-h-64"
                />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Try an example prompt:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example, index) => (
                      <Button
                        key={index}
                        size="sm"
                        onClick={() => setPrompt(example.content)}
                        className={cn(
                          "text-xs",
                          prompt === example.content ? "bg-blue-600" : ""
                        )}
                      >
                        {example.name}
                      </Button>
                    ))}
                  </div>
                </div>

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
                    className="flex items-center gap-2 bg-chart-5"
                    onClick={handleSubmit}
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
          )}

          {generatedCode && view === "code" && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Generated Code</CardTitle>
                    <CardDescription>
                      Your DSPy signature is ready
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={handleCopy} className="gap-2">
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
      <div className="w-full min-h-20 justify-between items-center border-t-2 border-black flex flex-wrap gap-4 px-4 sm:px-8 lg:px-16 py-4">
        <div className="font-semibold font-press-start-2p text-xs sm:text-sm">sgntrs.dev</div>
        <div className="flex items-center gap-1 sm:gap-2 font-medium text-gray-600">
          <Link href={"https://modaic.dev/"} target="_blank">
            <Button className="bg-orange-400 text-xs sm:text-sm px-3 sm:px-4">Modaic</Button>
          </Link>

          <Link href={"https://dspy.ai/"} target="_blank">
            <Button className="bg-orange-400 text-xs sm:text-sm px-3 sm:px-4">DSPy Docs</Button>
          </Link>

          <Link href={"https://discord.gg/5NZ3GZNq5k"} target="_blank">
            <Button className="bg-orange-400 text-xs sm:text-sm px-3 sm:px-4">Discord</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
