"use client"

import { fetchPrompt } from "@lib/fetchPrompt"
import { useState } from "react"
import PromptView from "./PromptView"
import ResponseView from "./ResponseView"

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [promptResponse, setPromptResponse] = useState<string>("")

  const onPromptSubmit = async (prompt: string) => {
    // Loading...
    setIsLoading(true)

    // Response...
    try {
      const response = await fetchPrompt(prompt)
      setPromptResponse(response)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex max-h-screen min-h-screen flex-col bg-neutral-900">
      <ResponseView isLoading={isLoading} promptResponse={promptResponse} />
      <PromptView isLoading={isLoading} onSubmitClicked={onPromptSubmit} />
    </main>
  )
}
