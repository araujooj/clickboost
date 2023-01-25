'use client'

import { clear } from 'console'
import { useEffect, useRef, useState } from 'react'
import styles from './page.module.css'


const typeText = (
  text: string,
  element: HTMLElement,
  instant: boolean = false
) => {
  if (instant) return element.innerHTML = text

  const textArray = text.split('')
  const interval = setInterval(() => {
    if (!textArray.length) {
      clearInterval(interval)
      return
    }
    element.innerHTML += textArray.shift()
  }, 50)
}


const DEFAULT_PROMPT_RESPONSE = "Ask this ChatGPT clone a question in the prompt below."
const LOADING_PROMPT_RESPONSE = "Loading..."


export default function Home() {
  const responseDivRef = useRef<HTMLDivElement>(null)
  const promptDivRef = useRef<HTMLTextAreaElement>(null)
  const [promptResponse, setPromptResponse] = useState<string>('')

  const onPromptButtonClicked = async () => {
    const prompt = promptDivRef.current?.value
    console.log('submitting to OpenAI', prompt)
    if (!prompt) return alert('Please enter a prompt')

    resetPromptResponse(LOADING_PROMPT_RESPONSE)

    const response = await fetch('/api/open-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })
    if (!response.ok) throw new Error('Something went wrong')
    
    const data = await response.json()
    setPromptResponse(data.result)
  }

  const resetPromptResponse = (text: string = '') => {
    if (!responseDivRef.current) return
    responseDivRef.current.innerHTML = text
  }

  const onClearButtonClicked = () => {
    resetPromptResponse()
  }

  useEffect(() => {
    if (!responseDivRef.current) return
    typeText(DEFAULT_PROMPT_RESPONSE, responseDivRef.current, true)
  }, [])

  useEffect(() => {
    resetPromptResponse()
    if (responseDivRef.current) {
      typeText(promptResponse, responseDivRef.current)
    }
  }, [promptResponse])

  return (
    <main className={styles.main}>
      <div style={{ 
        width: '100%',
        whiteSpace: 'pre-wrap',
        marginBottom: '30px'
      }} ref={responseDivRef} />
      <div style={{
        width: '100%',
        textAlign: 'center'
      }}>
        <textarea
          ref={promptDivRef}
          style={{
            marginBottom: '-5px',
            width: '70%',
            resize: 'vertical',
            marginRight: '10px'
          }}
          defaultValue="Create a component that displays a list of images in react."
        />
        <button 
          onClick={onPromptButtonClicked}
          style={{ marginRight: '10px' }}
        >
          Submit
        </button>
        <button onClick={onClearButtonClicked}>Clear</button>
      </div>
    </main>
  )
}
