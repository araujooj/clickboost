import { fetchPrompt } from "./fetchPrompt"

global.fetch = jest.fn() as jest.Mock

describe("fetchPrompt", () => {
  it("fetches the prompt and returns the result", async () => {
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          error: null,
          result: "Mock result",
        }),
    })

    jest
      .spyOn(global, "fetch")
      .mockImplementation((() => mockFetchPromise) as jest.Mock)

    const result = await fetchPrompt("mock prompt")

    expect(result).toBe("Mock result")
    expect(global.fetch).toHaveBeenCalledWith("/api/open-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: "mock prompt" }),
    })
  })

  it("throws an error when the response is not ok", async () => {
    const mockFetchPromise = Promise.resolve({
      ok: false,
    })
    jest
      .spyOn(global, "fetch")
      .mockImplementation((() => mockFetchPromise) as jest.Mock)

    await expect(fetchPrompt("mock prompt")).rejects.toThrow(
      "Something went wrong"
    )
  })

  it("throws an error when data.error is not null", async () => {
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          error: "Mock error",
          result: null,
        }),
    })
    jest
      .spyOn(global, "fetch")
      .mockImplementation((() => mockFetchPromise) as jest.Mock)

    await expect(fetchPrompt("mock prompt")).rejects.toThrow("Mock error")
  })

  it("throws an error when data.result is null", async () => {
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          error: null,
          result: null,
        }),
    })
    jest
      .spyOn(global, "fetch")
      .mockImplementation((() => mockFetchPromise) as jest.Mock)

    await expect(fetchPrompt("mock prompt")).rejects.toThrow("No result found")
  })
})
