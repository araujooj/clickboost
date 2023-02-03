"use client"

import { fetchPrompt } from "@lib/fetchPrompt"
import lang from "@lib/lang"
import { typeText } from "@lib/typeText"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const responseContainerDivRef = useRef<HTMLDivElement>(null)
  const responseDivRef = useRef<HTMLDivElement>(null)
  const promptSectionRef = useRef<HTMLDivElement>(null)
  const promptTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const [promptResponse, setPromptResponse] = useState<string>("")
  let typing = useRef<any>(() => {})

  useEffect(() => {
    if (
      !responseContainerDivRef.current ||
      !responseDivRef.current ||
      !promptSectionRef.current
    )
      return
    typeText(lang.defaultPrompt, responseDivRef.current, true)

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
      responseDivRef.current.innerText === lang.defaultPrompt
    )
      return

    clearPromptResponse()
    typing.current = typeText(promptResponse, responseDivRef.current)
  }, [promptResponse])

  const onPromptButtonClicked = async () => {
    const prompt = promptTextAreaRef.current?.value
    if (!prompt) return alert("Please enter a prompt")

    // Loading...
    clearPromptResponse(lang.loading)

    // Response...
    const response = await fetchPrompt(prompt)
    setPromptResponse(response)
  }

  const clearPromptResponse = (text: string = "") => {
    if (!responseDivRef.current || !typing.current) return
    typing.current()
    typeText(text, responseDivRef.current, true)
  }

  const onClearButtonClicked = () => {
    clearPromptResponse(lang.defaultPrompt)
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
    <main className="flex max-h-screen min-h-screen flex-col">
      <div
        className="w-full overflow-y-auto whitespace-pre-wrap px-6 pt-6"
        ref={responseContainerDivRef}
      >
        <div ref={responseDivRef} />
      </div>
      <div
        ref={promptSectionRef}
        className="fixed bottom-0 w-full flex-shrink bg-gray-800 py-3 text-center"
      >
        <textarea
          ref={promptTextAreaRef}
          className="resize-vertical mr-3 -mb-2 w-3/4 p-2"
          defaultValue="Create a component that displays a list of images in react."
        />
        <button
          onClick={onPromptButtonClicked}
          className="mr-3 rounded-sm bg-indigo-700 px-1.5 py-0.5"
        >
          Submit
        </button>
        <button onClick={onClearButtonClicked}>Clear</button>
      </div>
    </main>
  )
}
