import React, { useState } from 'react';
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
console.log(process.env.OPENAI_API_KEY)

  // @ts-ignore
  const vector = withVectorSearch(database, doc => doc.content, {openAIApiKey : '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'});

  const [inputValue, setInputValue] = useState('');

  const handleSendClick = () => {
    const runSearch = async () => {
      const results = await vector.search(inputValue);
      console.log(results);
    }

    console.log(inputValue);
    runSearch()
    setInputValue('');
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="absolute bottom-0 w-full p-4">
      <input 
        className="border p-2 rounded w-full" 
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
