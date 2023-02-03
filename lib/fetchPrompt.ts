export interface OpenAIResponse {
  result?: string
  full?: string
  error?: unknown
}

export const fetchPrompt = async (prompt: string) => {
  const response = await fetch("/api/open-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) throw new Error("Something went wrong")

  const data: OpenAIResponse = await response.json()
  if (data.error) throw new Error(data.error as string)
  if (!data.result) throw new Error("No result found")

  return data.result.trim()
}
