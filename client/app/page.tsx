"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [refine, setRefine] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setLoading(true)
    setError("")
    setGeneratedCode("")

    try {
      const response = await fetch("http://localhost:8000/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          refine: refine,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedCode(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Prompt to Signature</h1>
          <p className="text-muted-foreground">Convert natural language prompts into function signatures</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Your Prompt</CardTitle>
            <CardDescription>Describe the function you want to create</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., A function that calculates the factorial of a number"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="refine"
                  checked={refine}
                  onCheckedChange={setRefine}
                />
                <label
                  htmlFor="refine"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Refine output
                </label>
              </div>

              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Generate Signature
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
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>Your function signature is ready</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-zinc-950 dark:bg-zinc-900 text-zinc-50 overflow-x-auto">
                <code className="text-sm font-mono">{generatedCode}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
