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

  // console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY)

  // @ts-ignore
  const vector = withVectorSearch(database, doc => doc.content, {
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
  })

  const [inputValue, setInputValue] = useState('')

  const [results, setResults] = useState<{ doc: any; score: number }[]>([])

  const [conversationID, setConversationID] = useState<string | null>(null)

  const messages = useLiveQuery(
    (doc: any, emit: Function) => {
      if (doc.type === 'chat') {
        emit([doc.conversationID, doc.time], doc.message)
      }
    },
    { descending: true }
  )

  const [chat] = useState(
    new ChatOpenAI({
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
    })
  )

  const handleSendClick = async () => {
    const response = await newMessage(
      chat,
      database,
      vector,
      inputValue,
      conversationID || Math.random().toString(36).substring(2)
    )
    if (conversationID === null) {
      // const cnvid = Math.random().toString(36).substring(2)

      // await database.put({ conversationID: cnvid, ...response })
      setConversationID(response.conversationID)
      // } else {
      // await database.put({ conversationID, ...response })
    }
    setInputValue('')
  }

  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setInputValue(event.target.value)
  }

  // console.log('messages', messages)

  return (
    <div className="fixed bottom-0 w-2/3 h-1/3 p-4 bg-slate-600 flex flex-col">
      <ul className="overflow-auto flex-grow">
        {messages.rows.map((message: any) => (
          <ChatResponse key={message.id} doc={message.doc} />
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

async function newMessage(
  chat: ChatOpenAI,
  database: Database,
  vector: any,
  inputValue: string,
  conversationID: string
) {
  // const runSearch = async () => {
  const results = await vector.search(inputValue)
  // setResults(results)
  // console.log(results)
  // prompt chatgpt with the inputValue and results
  const prompt = makePrompt(
    results.map(r => r.doc),
    inputValue
  )

  const doc = {
    type: 'chat',
    conversationID,
    matches: results.map(r => ({ id: r.doc._id, score: r.score, title: r.doc.title })),
    prompt: inputValue,
    time: Date.now()
  }

  const ok = await database.put(doc)

  console.log('prompt', prompt.length, prompt)


  // @ts-ignore
  doc._id = ok.id

  const gptResponse = await chat.call([new HumanChatMessage(prompt)])
  // @ts-ignore
  doc.response = gptResponse.text
  await database.put(doc)
  return doc
}

function ChatResponse({ doc }) {
  return (
    <li className="p-4 mb-4">
      <p className="text-lg font-bold">{doc.prompt}</p>
      <p className="text-sm mb-2">{doc.response}</p>
      <ul className="mt-4">
        <li className="text-sm mb-1 inline-block">Matching topics:</li>{' '}
        {doc.matches?.map((match, index, array) => (
          <li key={match.id} className="text-sm px-1 inline-block">
            <Link
              className="text-blue-500 hover:underline"
              title={`Match: ${Math.floor(match.score * 100)}%`}
              href={`/topics/${match.id}`}
            >
              {match.title}
            </Link>
            {index < array.length - 1 ? ',' : ''}
          </li>
        ))}
      </ul>
    </li>
  )
}
