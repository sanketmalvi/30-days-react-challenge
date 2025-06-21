import { useState, useCallback, useEffect, useRef } from 'react'


function App() {
  const [length, setLength] = useState(8)
  const [numAllowed, setNumAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState()

  
  //useCallback used for optimization
  const passwordGenartor = useCallback(() => {  
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    
    if(numAllowed) str += "0123456789"
    if(charAllowed) str += "!@#$%&*()[]{}"
    
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      
      pass += str.charAt(char)
      
    }
    
    setPassword(pass)
    
  }, [length, numAllowed, charAllowed, setPassword])  //All that dependencies will store in cache memory. Dont compare it with the useEffect


  // useRef hook
  const passwordRef = useRef(null)
  
  const copyPasswordToClipboard = useCallback(()=> {
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
  },[password])
  

  useEffect( () => {
    passwordGenartor()
  }, [charAllowed, length, numAllowed])
  

  const reset = () =>document.getElementById('reset').value = ''
  
  
  
  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-6 mt-8   text-orange-500 bg-gray-800">

          <h1 className="text-white text-center font-serif text-2xl mb-6 pb-3">Password Generator</h1>
           <div className="flex shadow rouded-lg overflow-hidden mb-4">

            <input 
            type="text"
            value={password}
            className='outline-none rounded-l w-full py-1 px-3'
            placeholder='password'
            readOnly
            ref = {passwordRef}
            />

            <button onClick={copyPasswordToClipboard} className="outline-none rounded-r mx-0.5 bg-blue-700 text-white px-3 py-0 5 shrink-0 ">Copy</button>

           </div>
           <div className="flex text-sm gap-x-2">
            <div className="flex items-center gap-x-1">
              <input 
              type="range" 
              min={6}
              max={30}
              value={length}
              className='cursor-pointer'
              onChange={(e) => setLength(e.target.value)}
              />
              <label>Length: {length} </label>
            </div>

            <div className="flex items-center gap-x-1">
              <input 
              type="checkbox"
              defaultChecked={numAllowed}
              id='numInput'
              onChange={() => setNumAllowed((prev) => !prev)}
              />
              <label htmlFor="numInput">Numbers</label>
            </div>

            <div className="flex items-center gap-x-1">
              <input 
              type="checkbox"
              defaultChecked={charAllowed}
              id='numInput'
              onChange={() => setCharAllowed((prev) => !prev)}
              />
              <label htmlFor="charInput">Characters</label>
            </div>

           </div>
      </div>

      <div className=" flex w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-6 my-8 text-orange-500 bg-gray-800">
        <input 
            type="text"
            id='reset'
            className='outline-none rounded-l w-full py-1 px-3'
            placeholder='paste here'
            />
        <button onClick={reset} className=" outline-none rounded-r mx-0.5 bg-red-700 text-white px-3 py-0 5 shrink-0">reset</button>

      </div>
    </>
  )
}

export default App
  