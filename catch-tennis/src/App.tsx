import {useState} from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            {Array.from({length: 10}).map(() => (
                <div className="flex flex-col items-center">
                    <span className="text-heading-h1">TEXT-HEADING-H1</span>
                    <span className="text-heading-h2">TEXT-HEADING-H2</span>
                    <span className="text-heading-h3">TEXT-HEADING-H3</span>
                    <span className="text-heading-h4">TEXT-HEADING-H4</span>
                    <span className="text-body">TEXT-BODY</span>
                    <span className="text-small">TEXT-SMALL</span>
                    <span className="text-caption">TEXT-CAPTION</span>
                    <button
                        className="my-btn border-md border-primary-border bg-primary rounded-sm"
                        onClick={() => setCount((count) => count + 1)}>
                        count is {count}
                    </button>
                </div>
            ))}
        </>
    )
}

export default App
