'use client'

import { useEffect, useRef, useState } from 'react'
import { fetchPrompt } from './fetchPrompt'
import styles from './page.module.css'
import { typeText } from './typeText'

const DEFAULT_PROMPT_RESPONSE = "Ask this ChatGPT clone a question in the prompt below."
const LOADING_PROMPT_RESPONSE = "Loading..."


export default function Home() {
  const responseDivRef = useRef<HTMLDivElement>(null)
  const promptDivRef = useRef<HTMLTextAreaElement>(null)
  const [promptResponse, setPromptResponse] = useState<string>('')

  const onPromptButtonClicked = async () => {
    const prompt = promptDivRef.current?.value
    if (!prompt) return alert('Please enter a prompt')
    
    clearPromptResponse(LOADING_PROMPT_RESPONSE)

    const response = await fetchPrompt(prompt)
  
    setPromptResponse(response)
  }

  const clearPromptResponse = (text: string = '') => {
    if (!responseDivRef.current) return
    typeText(text, responseDivRef.current, true)
  }

  const onClearButtonClicked = () => {
    clearPromptResponse(DEFAULT_PROMPT_RESPONSE)
  }

  useEffect(() => {
    if (!responseDivRef.current) return
    typeText(DEFAULT_PROMPT_RESPONSE, responseDivRef.current, true)
  }, [])

  useEffect(() => {
    clearPromptResponse()
    if (responseDivRef.current) {
      typeText(promptResponse, responseDivRef.current)
    }
  }, [promptResponse])

  return (
    <main className={styles.main}>
      <div 
        style={{ 
          width: '100%',
          whiteSpace: 'pre-wrap',
          marginBottom: '30px'
        }} 
        className="underline"
        ref={responseDivRef} />
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
