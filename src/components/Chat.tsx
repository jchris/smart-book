import React, { useState } from 'react';
import Link from 'next/link';
import { useFireproof } from 'use-fireproof'
import {withVectorSearch} from "../helpers"

const Chat = () => {
  const { database } = useFireproof(
    'chagpt-hacks',
    () => {},
    () => {},
    {
      secondary: { type: 'rest', url: 'http://localhost:8000/chagpt-hacks' }
    }
  )
console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY)

  // @ts-ignore
  const vector = withVectorSearch(database, doc => doc.content, {openAIApiKey : process.env.NEXT_PUBLIC_OPENAI_API_KEY});

  const [inputValue, setInputValue] = useState('');

    const [results, setResults] = useState<{ doc: any; score: number; }[]>([]);

  const handleSendClick = () => {
    const runSearch = async () => {
      const results = await vector.search(inputValue);
      setResults(results);
    }

    runSearch()
    setInputValue('');
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="fixed bottom-0 w-1/2 p-4 bg-opacity-50 bg-slate-600">
    <ul>
        {results.map((result, index) => (
          <li key={index}>
            <Link className="text-blue-500 hover:underline" href={`/sections/${result.doc._id}`}>
            {result.score} {result.doc.title}
            </Link>
          </li>
        ))}
      </ul>
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
  );
};

export default Chat;
