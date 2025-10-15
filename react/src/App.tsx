import { useEffect, useState } from 'react';
import './App.css';


type MyButtonProps = {
    // colId: number;
    isClicked: boolean;
    handleClick: () => void
};

function MyButton({ isClicked, handleClick }: MyButtonProps) {
    // console.log('我属于', colId)
    return (
        <li className='border border-gray-300'>
            <button onClick={handleClick} style={{
                backgroundColor: isClicked ? 'black' : 'white'
            }}>
            </button>
        </li>

    )
}

function formatValue(values: number[]) {
    let list = [];
    for (let i = 0; i < values.length / 8; i++) {
        let c = values.slice(i * 8, (i + 1) * 8)
        let column = `0b${c.join('')}`
        list.push(column)
    }
    return list
}

function MyColumn({ values }: { values: number[] }) {
    const list = formatValue(values)
    // console.log('list', list)
    return (
        list.map((e, i) =>
            <div className='border-4 border-indigo-200 border-b-indigo-500 my-4'>
                <p key={i} className="font-mono text-center text-left m-2">{e}</p>
            </div>
        )
    )
}

function App() {
    const cols = 4
    // setButtons 是异步的
    // React 会把 setButtons 的更新批量推迟到本次事件处理函数执行完之后再重新渲染
    // State 更新是异步的
    // 要 “即算即用” 就利用 setState 的回调参数 prev，而不要去读外部闭包里的旧变量

    const [buttons, setButtons] = useState(() =>
        Array.from({ length: cols }, (_, colId) =>
            Array.from({ length: 8 }, (_, i) => ({ colId, id: i + 1, isClicked: false, value: 0 }))
        ).flat()
    );

    const [values, setValues] = useState<number[]>([]);

    const [copied, setCopied] = useState(false);

    // 可以把计算拆到 useEffect 里
    useEffect(() => {
        setValues(buttons.map(b => b.value));
    }, [buttons]);

    function handleClick(colId: number, id: number) {
        // console.log('click', colId, id)
        setButtons(prev =>
            prev.map(b =>
                b.colId === colId && b.id === id ? { ...b, isClicked: !b.isClicked, value: !b.isClicked === false ? 0 : 1 } : b
            )
        )
    }

    async function copy() {
        // console.log('values', values)
        const result = formatValue(values).join(',')
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('复制失败', err);
        }
    }


    function clear() {
        setButtons(prev =>
            prev.map(b => ({ ...b, isClicked: false, value: 0 }))
        )
    }


    return (
        <>
            <h1 className='underline decoration-wavy mb-8 decoration-pink-500/20 underline-offset-4 font-stretch-expanded text-blue-600/50 dark:text-sky-400/50'>Char Tool</h1>
            <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                <div className="card flex flex-row gap-8">
                    <div className="flex">
                        {
                            Array.from({ length: cols }, (_, colId) => (
                                <div key={colId}>{
                                    buttons
                                        .filter(b => b.colId === colId)
                                        .map(button =>
                                            <MyButton key={button.id}
                                                isClicked={button.isClicked}
                                                handleClick={() => handleClick(colId, button.id)}></MyButton>
                                        )
                                }</div>
                            ))
                        }
                    </div>
                    <div className="listShow m-auto">
                        <MyColumn values={values}></MyColumn>
                    </div>
                </div >
            </div>
            <div className='grid grid-cols-2 gap-4 mt-8'>
                <button onClick={copy} className="!bg-indigo-500 hover:bg-fuchsia-500 text-white">Copy</button>
                {copied && <span> ✅ 已复制</span>}
                <button onClick={clear}>Clear</button>
            </div>
        </>
    )
}

export default App
