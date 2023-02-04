"use client"

import { fetchPrompt } from "@lib/fetchPrompt"
import lang from "@lib/lang"
import { typeText } from "@lib/typeText"
import { useEffect, useRef, useState } from "react"
import Prompt from "./Prompt"

export default function Home() {
  const responseContainerDivRef = useRef<HTMLDivElement>(null)
  const responseDivRef = useRef<HTMLDivElement>(null)
  const promptTextAreaRef = useRef<HTMLTextAreaElement>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [promptResponse, setPromptResponse] = useState<string>("")

  let typing = useRef<() => void>()

  useEffect(() => {
    if (!responseContainerDivRef.current || !responseDivRef.current) return
    typeText(lang.promptDefault, responseDivRef.current, true)

    const responseArea = new ResizeObserver(scrollResponseDiv)
    responseArea.observe(responseDivRef.current)

    return () => {
      responseArea.disconnect()
    }
  }, [])

  useEffect(() => {
    if (
      !responseDivRef.current ||
      responseDivRef.current.innerHTML === lang.promptDefault
    )
      return

    clearPromptResponse()
    typing.current = typeText(promptResponse, responseDivRef.current)
  }, [promptResponse])

  const onPromptSubmit = async (prompt: string) => {
    // Loading...
    setIsLoading(true)
    clearPromptResponse(lang.loading)

    // Response...
    try {
      const response = await fetchPrompt(prompt)
      setPromptResponse(response)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
    }
  }

  const clearPromptResponse = (text: string = "") => {
    if (!responseDivRef.current) return
    if (typing.current) typing.current()
    typeText(text, responseDivRef.current, true)
  }

  const onClearButtonClicked = () => {
    clearPromptResponse(lang.promptDefault)
  }

  const scrollResponseDiv = ([{ target: element }]: ResizeObserverEntry[]) => {
    if (!responseContainerDivRef.current) return
    responseContainerDivRef.current.scrollTop = element.scrollHeight
  }

  return (
    <main className="flex max-h-screen min-h-screen flex-col bg-neutral-900">
      <div
        className="w-full flex-grow overflow-y-auto whitespace-pre-wrap p-6"
        ref={responseContainerDivRef}
      >
        <div ref={responseDivRef} />
      </div>
      <Prompt isLoading={isLoading} onSubmitClicked={onPromptSubmit} />
    </main>
  )
}
