import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <button className="bg-primary-600 font-bold">
                    Click me
                    프리텐다드 배리어블
                </button>
                <button className="bg-primary-500">
                    Click me
                </button>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <h1>한글 프리텐다드 닫드 배리어블ㄹㄹㄹㄴㅁㅇㄹ</h1>
            <h1>012345678901234567890123456789</h1>
            <h1 className="font-sans">한글 프리텐다드 닫드 배리어블ㄹㄹㄹㄴㅁㅇㄹ</h1>
            <h1 className="font-sans">012345678901234567890123456789</h1>
            <h1 className="font-family-sans">한글 프리텐다드 닫드 배리어블ㄹㄹㄹㄴㅁㅇㄹ</h1>
            <h1 className="font-family-sans">012345678901234567890123456789</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
