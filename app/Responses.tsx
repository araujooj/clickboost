import lang from "@lib/lang"
import { typeText } from "@lib/typeText"
import { useEffect, useRef } from "react"

interface ResponsesProps {
  isLoading: boolean
  promptResponse: string
}

export default function Responses({
  promptResponse,
  isLoading,
}: ResponsesProps) {
  const responseContainerRef = useRef<HTMLDivElement>(null)
  const responseRef = useRef<HTMLSpanElement>(null)
  let typing = useRef<() => void>()

  useEffect(() => {
    if (!responseContainerRef.current || !responseRef.current) return

    typeText(lang.promptDefault, responseRef.current, true)

    const responseArea = new ResizeObserver(scrollResponseDiv)
    responseArea.observe(responseRef.current)

    return () => {
      responseArea.disconnect()
      typing.current?.()
    }
  }, [])

  useEffect(() => {
    if (!responseRef.current) return
    if (isLoading) {
      setPromptResponse()
      typing.current = typeText(lang.loading, responseRef.current)
      return
    }
    if (
      promptResponse === "" &&
      responseRef.current.innerHTML === lang.promptDefault
    ) {
      return
    }

    setPromptResponse()

    typing.current = typeText(promptResponse, responseRef.current)
  }, [promptResponse, isLoading])

  const setPromptResponse = (text: string = "") => {
    if (!responseRef.current) return

    if (typing.current) typing.current()
    typeText(text, responseRef.current, true)
  }

  const scrollResponseDiv = ([{ target: element }]: ResizeObserverEntry[]) => {
    if (!responseContainerRef.current) return

    responseContainerRef.current.scrollTop = element.scrollHeight
  }

  return (
    <div
      className="w-full flex-grow overflow-y-auto whitespace-pre-wrap p-6"
      ref={responseContainerRef}
    >
      <span ref={responseRef} />
      <span className="mx-1 -mb-0.5 inline-block h-4 w-1.5 animate-blink bg-white" />
    </div>
  )
}
