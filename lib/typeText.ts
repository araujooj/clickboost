export const typeTextOptions = {
  timePerCharacter: 25,
}

export const typeText = (
  text: string,
  element: HTMLElement,
  instant: boolean = false
) => {
  if (instant) {
    element.innerHTML = text
    return
  }

  const textArray = text.split("")
  const interval = setInterval(() => {
    if (!textArray.length) {
      clearInterval(interval)
      return
    }
    element.innerHTML += textArray.shift()
  }, typeTextOptions.timePerCharacter)

  return () => clearInterval(interval)
}
