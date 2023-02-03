"use client"

import { fetchPrompt } from "@lib/fetchPrompt"
import lang from "@lib/lang"
import { typeText } from "@lib/typeText"
import { MouseEvent, useEffect, useRef, useState } from "react"

export default function Home() {
  const responseContainerDivRef = useRef<HTMLDivElement>(null)
  const responseDivRef = useRef<HTMLDivElement>(null)
  const promptSectionRef = useRef<HTMLDivElement>(null)
  const promptTextAreaRef = useRef<HTMLTextAreaElement>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [promptResponse, setPromptResponse] = useState<string>("")

  let typing = useRef<() => void>()

  useEffect(() => {
    if (
      !responseContainerDivRef.current ||
      !responseDivRef.current ||
      !promptSectionRef.current
    )
      return
    typeText(lang.promptDefault, responseDivRef.current, true)

    const promptArea = new ResizeObserver(resizeResponseDiv)
    promptArea.observe(promptSectionRef.current)

    const responseArea = new ResizeObserver(scrollResponseDiv)
    responseArea.observe(responseDivRef.current)

    return () => {
      promptArea.disconnect()
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

  const onPromptButtonClicked = async (ev: MouseEvent<HTMLButtonElement>) => {
    const prompt = promptTextAreaRef.current?.value
    if (!prompt) return alert("Please enter a prompt")

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

  const resizeResponseDiv = ([{ target: element }]: ResizeObserverEntry[]) => {
    if (!responseContainerDivRef.current) return
    responseContainerDivRef.current.style.paddingBottom = `calc(${element.clientHeight}px + 1.5rem)`
  }

  const scrollResponseDiv = ([{ target: element }]: ResizeObserverEntry[]) => {
    if (!responseContainerDivRef.current) return
    responseContainerDivRef.current.scrollTop = element.scrollHeight
  }

  return (
    <main className="flex max-h-screen min-h-screen flex-col bg-neutral-900">
      <div
        className="w-full overflow-y-auto whitespace-pre-wrap px-6 pt-6"
        ref={responseContainerDivRef}
      >
        <div ref={responseDivRef} />
      </div>
      <div
        ref={promptSectionRef}
        className="fixed bottom-0 w-full flex-shrink bg-neutral-800 py-3 text-center"
      >
        <textarea
          ref={promptTextAreaRef}
          placeholder={lang.promptPlaceholder}
          className="resize-vertical mr-3 -mb-2 w-3/4 rounded bg-neutral-700 p-2"
        />
        <button
          onClick={onPromptButtonClicked}
          disabled={isLoading}
          className="mr-3 rounded bg-indigo-700 px-1.5 py-0.5 transition-colors duration-200 hover:bg-indigo-500 disabled:opacity-75"
        >
          Submit
        </button>
        <button
          onClick={onClearButtonClicked}
          disabled={isLoading}
          className="rounded bg-transparent px-1.5 py-0.5 transition-colors duration-200 hover:bg-gray-700"
        >
          Clear
        </button>
      </div>
    </main>
  )
}
