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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
        <div className="font-semibold font-press-start-2p text-xs sm:text-sm">
          sgntrs.dev
        </div>
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
            <span className="hidden sm:inline">Powered by </span>
            <span className="text-orange-500 font-bold">Modaic</span>
          </Link>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-full lg:max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tightest font-press-start-2p">
              Prompt to DSPy Signature
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium px-4">
              Convert lossy, static prompts into structured DSPy signatures
            </p>
          </div>
          {view === "info" && (
            <div className="flex flex-col gap-6">
              <Card className="rounded-sm border-b-2">
                <CardHeader>
                  <CardTitle>What are DSPy Signatures?</CardTitle>
                  <CardDescription>
                    Learn about the declarative way to program with LMs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    When we assign tasks to LMs in DSPy, we specify the behavior
                    we need as a <strong>Signature</strong>.
                  </p>
                  <p>
                    <strong>
                      A signature is a declarative specification of input/output
                      behavior of a DSPy module.
                    </strong>{" "}
                    Signatures allow you to tell the LM <em>what</em> it needs
                    to do, rather than specify <em>how</em> we should ask the LM
                    to do it.
                  </p>
                  <p>
                    You&apos;re probably familiar with function signatures,
                    which specify the input and output arguments and their
                    types. DSPy signatures are similar, but with a couple of
                    differences:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      While typical function signatures just <em>describe</em>{" "}
                      things, DSPy Signatures{" "}
                      <em>declare and initialize the behavior</em> of modules
                    </li>
                    <li>
                      The field names matter in DSPy Signatures - you express
                      semantic roles in plain English: a{" "}
                      <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                        question
                      </code>{" "}
                      is different from an{" "}
                      <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                        answer
                      </code>
                      , a{" "}
                      <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                        sql_query
                      </code>{" "}
                      is different from{" "}
                      <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                        python_code
                      </code>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-muted-foreground">
                      Learn more in the{" "}
                      <Link
                        href="https://dspy.ai/learn/programming/signatures/"
                        target="_blank"
                        className="text-orange-500 hover:underline font-semibold"
                      >
                        official DSPy documentation
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border-b-2">
                <CardHeader>
                  <CardTitle>Why Use DSPy Signatures?</CardTitle>
                  <CardDescription>
                    Build modular, optimizable LM programs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    For <strong>modular and clean code</strong>, in which LM
                    calls can be optimized into high-quality prompts (or
                    automatic finetunes).
                  </p>
                  <p>
                    Most people coerce LMs to do tasks by hacking long, brittle
                    prompts or by collecting/generating data for fine-tuning.
                    Writing signatures is far more:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Modular</strong> - Clean separation of concerns
                    </li>
                    <li>
                      <strong>Adaptive</strong> - Works across different LMs
                    </li>
                    <li>
                      <strong>Reproducible</strong> - Consistent behavior
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                    <p className="text-sm">
                      💡 <strong>Pro Tip:</strong> The DSPy compiler will figure
                      out how to build a highly-optimized prompt for your LM (or
                      finetune your small LM) for your signature, on your data,
                      and within your pipeline. In many cases, compiling leads
                      to better prompts than humans write!
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-sm border-b-2 w-full">
                  <CardHeader>
                    <CardTitle>Inline Signatures</CardTitle>
                    <CardDescription>
                      Quick and simple string-based definitions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      Signatures can be defined as a short string, with argument
                      names that define semantic roles:
                    </p>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold mb-1">
                          Question Answering:
                        </p>
                        <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded block">
                          &quot;question -&gt; answer&quot;
                        </code>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">
                          Sentiment Classification:
                        </p>
                        <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded block">
                          &quot;sentence -&gt; sentiment: bool&quot;
                        </code>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">
                          Retrieval-Augmented QA:
                        </p>
                        <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded block text-xs">
                          &quot;context: list[str], question: str -&gt; answer:
                          str&quot;
                        </code>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900">
                      <p className="text-xs">
                        <strong>Tip:</strong> Field names should be semantically
                        meaningful, but start simple! Leave optimization to the
                        DSPy compiler.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-sm border-b-2 w-full">
                  <CardHeader>
                    <CardTitle>Class-based Signatures</CardTitle>
                    <CardDescription>
                      Advanced signatures with detailed specifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      For advanced tasks, use class-based signatures to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                      <li>Clarify the nature of the task with a docstring</li>
                      <li>
                        Supply hints on input fields with{" "}
                        <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                          desc
                        </code>
                      </li>
                      <li>Add constraints on output fields</li>
                      <li>
                        Use{" "}
                        <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                          Literal
                        </code>{" "}
                        types for specific values
                      </li>
                    </ul>
                    <div className="mt-4 bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-zinc-100">
                        <code>{`class Emotion(dspy.Signature):
    """Classify emotion."""

    sentence: str = dspy.InputField()
    sentiment: Literal['joy', 'anger'] = \\
        dspy.OutputField()`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Example: Sentiment Classification</CardTitle>
                  <CardDescription>
                    See DSPy Signatures in action
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-zinc-100">
                      <code>{`# Simple inline signature
sentence = "it's a charming and often affecting journey."

classify = dspy.Predict('sentence -> sentiment: bool')
classify(sentence=sentence).sentiment
# Output: True

# With Chain of Thought reasoning
document = """The 21-year-old made seven appearances..."""

summarize = dspy.ChainOfThought('document -> summary')
response = summarize(document=document)

print(response.summary)  # Gets the summary
print(response.reasoning)  # Gets the LM's reasoning process`}</code>
                    </pre>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Notice how{" "}
                    <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">
                      ChainOfThought
                    </code>{" "}
                    automatically adds a{" "}
                    <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">
                      reasoning
                    </code>{" "}
                    field to track the LM&apos;s thought process.
                  </p>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Common questions about DSPy Signatures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        What&apos;s the difference between inline and
                        class-based signatures?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">
                          <strong>Inline signatures</strong> (like{" "}
                          <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                            &quot;question -&gt; answer&quot;
                          </code>
                          ) are perfect for simple, straightforward tasks.
                          They&apos;re quick to write and easy to read.
                        </p>
                        <p>
                          <strong>Class-based signatures</strong> are better
                          when you need to provide additional context,
                          constraints, or documentation. Use them when you want
                          to specify field descriptions, add a docstring
                          explaining the task, or use complex types like{" "}
                          <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                            Literal
                          </code>{" "}
                          or{" "}
                          <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                            dict[str, list[str]]
                          </code>
                          .
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        How do I add instructions to my signature?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">
                          You can add instructions using the{" "}
                          <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                            instructions
                          </code>{" "}
                          keyword argument when creating a signature:
                        </p>
                        <div className="bg-zinc-900 rounded p-3 overflow-x-auto">
                          <pre className="text-xs text-zinc-100">
                            <code>{`toxicity = dspy.Predict(
    dspy.Signature(
        "comment -> toxic: bool",
        instructions="Mark as 'toxic' if the comment \\
includes insults or harassment."
    )
)`}</code>
                          </pre>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        What types can I use in signatures?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">DSPy signatures support:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 text-sm mb-2">
                          <li>
                            <strong>Basic types:</strong>{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              str
                            </code>
                            ,{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              int
                            </code>
                            ,{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              bool
                            </code>
                            ,{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              float
                            </code>
                          </li>
                          <li>
                            <strong>Collections:</strong>{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              list[str]
                            </code>
                            ,{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              dict[str, int]
                            </code>
                          </li>
                          <li>
                            <strong>Optional types:</strong>{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              Optional[float]
                            </code>
                            ,{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              Union[str, int]
                            </code>
                          </li>
                          <li>
                            <strong>Literal values:</strong>{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              Literal[&apos;yes&apos;, &apos;no&apos;,
                              &apos;maybe&apos;]
                            </code>
                          </li>
                          <li>
                            <strong>Custom types:</strong> Pydantic models and
                            custom classes
                          </li>
                          <li>
                            <strong>Special types:</strong>{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                              dspy.Image
                            </code>{" "}
                            for multi-modal tasks
                          </li>
                        </ul>
                        <p className="text-sm">
                          The default type is always{" "}
                          <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
                            str
                          </code>{" "}
                          if not specified.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        Can I use signatures for multi-modal tasks?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">
                          Yes! DSPy supports multi-modal signatures using{" "}
                          <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                            dspy.Image
                          </code>
                          :
                        </p>
                        <div className="bg-zinc-900 rounded p-3 overflow-x-auto">
                          <pre className="text-xs text-zinc-100">
                            <code>{`class DogPictureSignature(dspy.Signature):
    """Output the dog breed in the image."""
    image_1: dspy.Image = dspy.InputField(
        desc="An image of a dog"
    )
    answer: str = dspy.OutputField(
        desc="The dog breed"
    )

classify = dspy.Predict(DogPictureSignature)
classify(image_1=dspy.Image.from_url(url))`}</code>
                          </pre>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>
                        How do signatures work with DSPy optimizers?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">
                          Signatures are designed to work seamlessly with
                          DSPy&apos;s compilation and optimization system. When
                          you compile a DSPy program, the optimizer:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4 text-sm mb-2">
                          <li>
                            Automatically generates optimized prompts based on
                            your signatures
                          </li>
                          <li>
                            Tunes these prompts against your training data and
                            metrics
                          </li>
                          <li>
                            Can even generate fine-tuning datasets for smaller
                            models
                          </li>
                        </ul>
                        <p className="text-sm">
                          This means you write clean, declarative signatures,
                          and DSPy handles the complex prompt engineering or
                          fine-tuning for you!
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="w-full bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-900">
                <CardHeader>
                  <CardTitle>Ready to Get Started?</CardTitle>
                  <CardDescription>
                    Convert your prompts into optimizable DSPy signatures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Switch to the <strong>Code</strong> tab above to convert
                    your existing prompts into DSPy signatures. The more
                    descriptive your prompt, the better your signature will be!
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      onClick={() => setView("code")}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Try the Converter
                    </Button>
                    <Link
                      href="https://dspy.ai/learn/programming/signatures/"
                      target="_blank"
                    >
                      <Button className="border-orange-300 bg-transparent">
                        Read Full Documentation
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

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
        <div className="font-semibold font-press-start-2p text-xs sm:text-sm">
          sgntrs.dev
        </div>
        <div className="flex items-center gap-1 sm:gap-2 font-medium text-gray-600">
          <Link href={"https://modaic.dev/"} target="_blank">
            <Button className="bg-orange-400 text-xs sm:text-sm px-3 sm:px-4">
              Modaic
            </Button>
          </Link>

          <Link
            href={"https://dspy.ai/learn/programming/signatures/"}
            target="_blank"
          >
            <Button className="bg-orange-400 text-xs sm:text-sm px-3 sm:px-4">
              DSPy Docs
            </Button>
          </Link>

          <Link href={"https://discord.gg/5NZ3GZNq5k"} target="_blank">
            <Button className="bg-orange-400 text-xs sm:text-sm px-3 sm:px-4">
              Discord
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
