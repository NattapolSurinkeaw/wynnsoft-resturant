import React, { useState,useEffect, use } from 'react'
import { getTest } from './services/auth.service';

export default function Home() {
  const [test, setTest] = useState("");
   
  useEffect(() => {
    getTest().then((res) => {
      setTest(res.message);
    })
  }, [])
  
  return (
    <div>
      <h1 className='text-red-500'>Hello world</h1>
      <h2>{test}</h2>
    </div>
  )
}
