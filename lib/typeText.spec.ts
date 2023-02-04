import { typeText, typeTextOptions } from "./typeText"

describe("typeText", () => {
  it("returns the text if instant is true", () => {
    const element = document.createElement("div")

    typeText("mock text", element, true)

    expect(element.innerHTML).toBe("mock text")
  })

  it("types the text into an element", async () => {
    const element = document.createElement("div")
    const text = "mock text"

    typeText(text, element)

    await new Promise((resolve) =>
      setTimeout(resolve, text.length * typeTextOptions.timePerCharacter + 100)
    )

    expect(element.innerHTML).toBe("mock text")
  })

  it("cancels the text currently typing into an element", async () => {
    const element = document.createElement("div")
    const text = "mock text"

    const typing = typeText(text, element)
    const typePromise = new Promise((resolve) =>
      setTimeout(resolve, text.length * typeTextOptions.timePerCharacter + 100)
    )

    const cancelTime = 115
    const cancelPromise = new Promise<void>((resolve) =>
      setTimeout(() => {
        typing && typing()
        resolve()
      }, cancelTime)
    )

    const expectedResult = text.slice(
      0,
      cancelTime / typeTextOptions.timePerCharacter
    )

    await Promise.all([typePromise, cancelPromise])

    expect(element.innerHTML).toBe(expectedResult)
  })
})
