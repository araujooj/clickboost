export const typeText = (
  text: string,
  element: HTMLElement,
  instant: boolean = false
) => {
  if (instant) return (element.innerHTML = text)

  const textArray = text.split("")
  const interval = setInterval(() => {
    if (!textArray.length) {
      clearInterval(interval)
      return
    }
    element.innerHTML += textArray.shift()
  }, 50)

  return () => clearInterval(interval)
}
