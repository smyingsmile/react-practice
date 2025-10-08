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
        <li>
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
            <p key={i}>{e}</p>
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
            <h1>Char Tool</h1>
            <div className="card">
                <div className="columns">
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
                <div className="listShow">
                    <MyColumn values={values}></MyColumn>
                </div>
                <div className='buttonGroup'>
                    <button onClick={copy}>Copy</button>
                    {copied && <span> ✅ 已复制</span>}
                    <button onClick={clear}>Clear</button>
                </div>

                <p>

                </p>
            </div>
            <p className="read-the-docs">
                {/* {{ chars }} */}
            </p>
        </>
    )
}

export default App
