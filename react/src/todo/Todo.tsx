import { useState } from 'react';

const log = console.log.bind('console')

interface List {
    value: string;
    status: string;
}

interface ListProps {
    list: List[]
    updateStatus: (i: number, status: string) => void;
    saveEdit: (i: number, value: string) => void;
    removeItem: (i: number) => void;
}

// TODO: 保证当前有且只有一个被改变的 input value
function List({ list, updateStatus, saveEdit, removeItem }: ListProps) {
    const [text, setText] = useState<string>('');
    const [statusList, setStatusList] = useState<number[]>([]);
    // const [status, setStatus] = useState<string>('default')

    const handleChange = (e: any) => {
        console.log('e', e)
        // setText(e.target?.value)
    }

    const onEdit = (i: number) => {
        // 直接 list[i].status = … 是在 mutate 原对象，引用没变，React 会认为 state 没更新，页面不刷新。

        // 同时只支持 edit 一个, 其他会默认设置回 default mode
        if (statusList.includes(i)) {
            // do nothing
        } else {
            updateStatus(statusList[0], 'default')
            // statusList.pop()
            setStatusList(pre => pre.slice(1))
        }
        updateStatus(i, 'edit')
        setStatusList(pre => pre.concat(i))
        console.log('i', i, statusList)
    }

    const onSave = (i: number) => {
        saveEdit(i, text)
    }

    const onDone = (task: List, i: number) => {
        if (task.status === 'done') {
            updateStatus(i, 'default')
        } else {
            updateStatus(i, 'done')
        }
    }

    const onDelete = (i: number) => {
        // remove from the list
        removeItem(i)
    }

    const dynamicItem = (task: List) => {
        if (task.status === 'edit') {
            // 增加 edit 时, 默认显示之前的 value
            setText(task.value)
            return <input className="border border-dashed w-45 h-10 px-2 focus:border-indigo-600 focus:outline-hidden"
                onChange={handleChange} value={text}></input>
        } else if (task.status === 'done') {
            return <p className='line-through decoration-pink-500'>{task.value}</p>
        } else {
            return <p>{task.value}</p>
        }
    }

    return (
        <div >
            <div className='grid grid-cols-3 gap-2 items-center mb-2'>
                <h2> Task List </h2>
                <h2> Action List </h2>
            </div>
            <div className='box-content size-110 p-4 overflow-auto'>
                {
                    list.map((task, i) => (
                        <li key={i} className='grid grid-cols-3 gap-2 items-center mb-2'>
                            <div>
                                {dynamicItem(task)}
                            </div>
                            <div className='col-span-2 grid grid-cols-3 ml-8 gap-1'>
                                {
                                    task.status === 'edit' ?
                                        <button className='!bg-blue-500/30' onClick={() => onSave(i)}>Save</button> :
                                        <button onClick={() => onEdit(i)}>Edit</button>
                                }
                                <button className='!bg-green-500/30' onClick={() => onDone(task, i)}>Done</button>
                                <button className='!bg-red-500/30' onClick={() => onDelete(i)}>delete</button>
                            </div>
                        </li>
                    ))
                }
            </div>

        </div>
    )
}


function Empty() { return <p>No data in the list now</p> }


function Todo() {
    const [value, setValue] = useState<string>('');
    const [list, setList] = useState<List[]>([]);

    const handleChange = (e: any) => {
        // console.log('e', e)
        setValue(e.target?.value)
    }

    function handleClick(action: string, value: string) {
        if (value === '' || value.trim() === '') return
        if (action === 'add') {
            // 传给 list 组件
            // console.log('action', action, value)
            setList(prev => prev.concat({ value, status: 'default' }))
            setValue('')
        } else {
            // 重置 value
            value = ''
            setValue('')
        }
    }

    const updateStatus = (index: number, newStatus: string) => {
        setList(prev => prev.map((e, i) => i === index ? { ...e, status: newStatus } : e))
    }

    const saveEdit = (index: number, newValue: string) => {
        setList(prev => prev.map((e, i) => i === index ? { ...e, value: newValue, status: 'default' } : e))
    }

    function removeItem(index: number) {
        setList(prev => prev.filter((_, i) => i !== index))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleClick('add', value)
        }
    }

    return (
        <>
            <h1 className='bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent mb-15'>TODO List</h1>
            <div className="flex justify-center m-8 items-center">
                <input type="text"
                    className="h-10 mr-4 block w-full max-w-xs border-b-2 border-gray-300 bg-gray-50 px-2 py-2 text-sm text-gray-800 focus:border-indigo-600 focus:outline-hidden dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-indigo-500"
                    value={value} onChange={handleChange} placeholder="enter todo" onKeyDown={handleKeyDown}>
                </input>
                <button className="!bg-indigo-500 hover:bg-fuchsia-500 text-white" onClick={() => handleClick('add', value)}>Add</button>
                <button className="!bg-gray-500/20 ml-4" onClick={() => handleClick('clear', value)}>Clear</button>
            </div>
            <div className="box-border size-132 p-4 rounded outline-offset-2 outline-double outline-4 outline-blue-500/50">
                <div className="" >
                    {!list.length || list.length === 0 ?
                        <Empty /> :
                        <List list={list} updateStatus={updateStatus} saveEdit={saveEdit} removeItem={removeItem} />
                    }
                </div>
            </div>


        </>
    )
}

export default Todo
