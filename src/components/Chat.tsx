import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { FireproofCtx } from 'use-fireproof'
import { withVectorSearch } from '../helpers'

import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'
import { Database } from '@fireproof/core'
import { data } from 'autoprefixer'

const Chat = () => {
  const { database, useLiveQuery } = useContext(FireproofCtx)

  console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY)

  // @ts-ignore
  const vector = withVectorSearch(database, doc => doc.content, {
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
  })

  const [inputValue, setInputValue] = useState('')

  const [results, setResults] = useState<{ doc: any; score: number }[]>([])

  const [conversationID, setConversationID] = useState<string | null>(null)

  const messages = useLiveQuery((doc: any, emit: Function) => {
    if (doc.type === 'chat') {
      emit([doc.conversationID, doc.time], doc.message)
    }
  })

  const [chat] = useState(
    new ChatOpenAI({
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
    })
  )

  const handleSendClick = async () => {
    const response = await newMessage(chat, database, vector, inputValue)
    if (conversationID === null) {
      const cnvid = Math.random().toString(36).substring(2)
      await database.put({
        conversationID: cnvid,
        message: response,
        time: Date.now(),
        type: 'chat'
      })
      setConversationID(cnvid)
    } else {
      await database.put({
        conversationID: conversationID,
        message: response,
        time: Date.now(),
        type: 'chat'
      })
    }
    setInputValue('')
  }

  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setInputValue(event.target.value)
  }

  console.log('messages', messages)

  return (
    <div className="fixed bottom-0 w-1/2 h-1/3 p-4 bg-opacity-50 bg-slate-600">
      {/* <ul>
        {results.map((result, index) => (
          <li key={index}>
            <Link className="text-blue-500 hover:underline" href={`/topics/${result.doc._id}`}>
              {result.score} {result.doc.title}
            </Link>
          </li>
        ))}
      </ul> */}
    <ul>
      {messages.rows.map((message: any) => (
        <li key={message._id}>
          {message.value}
        </li>
      ))}
    </ul>
      <div className="fixed bottom-0">
        <input
          className="border p-2 rounded w-full text-black"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleSendClick}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat

function makePrompt(docs: any[], inputValue: any) {
  const docSummaries = docs
    .map((doc: { title: string; content: string }) => doc.title + ': ' + doc.content.substring(0, 1000) + '...')
    .join('\n\n')
  return `Answer the user's question: ${inputValue}. Based your answer on the following content\n\n${docSummaries}\n\nUser: ${inputValue}`
}

async function newMessage(chat: ChatOpenAI, database: Database, vector: any, inputValue: string) {
  // const runSearch = async () => {
  const results = await vector.search(inputValue)
  // setResults(results)
  console.log(results)
  // prompt chatgpt with the inputValue and results
  const prompt = makePrompt(
    results.map(r => r.doc),
    inputValue
  )
  console.log('prompt', prompt.length, prompt)

  const gptResponse = await chat.call([new HumanChatMessage(prompt)])
  return gptResponse.text
}
