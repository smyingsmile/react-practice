
import { useEffect, useMemo, useState } from "react";
import { getUsers } from './mock';

const log = console.log.bind('console')

interface DataListProps {
    value: string; // 搜索关键字
}

function Empty() { return <p>No result for your search</p> }

function DataList({ value }: DataListProps) {
    const cssText = 'mx-2 px-2 border border-dashed rounded'

    const [page, setPage] = useState<number>(1)

    const [size, setSize] = useState<number>(10)

    const [total, setTotal] = useState(0)

    // 一个 useEffect 只负责 “一类副作用”
    // 关键字/页量变化回到第一页
    useEffect(() => {
        setPage(1)
    }, [value, size])

    // 当前页 过滤
    const { data, total: fetchTotal } = useMemo(() => {
        // 拿全量（含分页）
        log('in useMemo')
        const res = getUsers(page, size)
        const filtered = res.data.filter((e: any) =>
            e.name.toLowerCase().includes(value.toLowerCase())
            || e.email.toLowerCase().includes(value.toLowerCase())
        );
        return { data: filtered, total: filtered.length }
        // 依赖变化自动重算
    }, [page, size, value])

    useEffect(() => {
        setTotal(fetchTotal)
    }, [fetchTotal])

    if (total === 0) {
        return (<Empty />)
    } else {
        return (
            <div className="w-4/5 mx-auto">
                <div className="my-4 grid grid-cols-4 gap-4 font-mono font-semibold">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Address</div>
                    <div>Phone</div>
                </div>
                <div className="h-[54vh] overflow-auto border-indigo-500/20 border-t-1">
                    {
                        data.map((e: any) => {
                            return (
                                <div key={e.id} className="grid grid-cols-4 gap-4 border-b-1 border-indigo-500/20 p-2">
                                    <div>{e.name}</div>
                                    <div>{e.email}</div>
                                    <div>{e.address}</div>
                                    <div>{e.phone}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="m-6">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            Total Count: <span className={cssText}>{total}</span>
                        </div>
                        <div>
                            Current Page: <span className={cssText}>{page}</span>
                        </div>
                        <div>
                            Total Page: <span className={cssText}>{Math.ceil(total / page)}</span>
                        </div>
                        <div>
                            PageSize:
                            <select
                                className={`${cssText}`}
                                name="PageSize"
                                id="size"
                                value={size}
                                onChange={(ev) => setSize(Number(ev.target.value))}>
                                {
                                    [10, 20, 50, 100, 500].map(v => <option key={v} value={v}>{v}</option>)
                                }
                            </select>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

function FormSearch() {
    // 1. set up basic layout
    // 2. bind basic function
    // 3. debounce and throttle
    // 4. search for 10W+ mock api or json
    // 5. try the ways for virtual form

    // input and show
    const [value, setValue] = useState<string>('')
    // real search
    const [keyword, setKeyword] = useState<string>('');

    const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e?.target.value)
    }

    const handleClick = (action: string, value: string) => {
        if (action === 'search') {
            // try to get api response
            log('search', value)
            setKeyword(value.trim())
        } else if (action === 'clear') {
            setValue('')
            setKeyword('')
        } else {
            //
            log('unkonwn action', action)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'enter') {
            handleClick('search', value)
        }
    }

    return (
        <>
            <div>
                <h1 className='bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent mb-15'>Search & virtual form</h1>
                <div className="flex justify-center m-8 items-center">
                    <input type="text"
                        className="h-10 mr-4 block w-full max-w-xs border-b-2 border-gray-300 bg-gray-50 px-2 py-2 text-sm text-gray-800 focus:border-indigo-600 focus:outline-hidden dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-indigo-500"
                        value={value}
                        placeholder="Search user/email"
                        onChange={handlechange} onKeyDown={handleKeyDown}
                    />
                    <button className="!bg-indigo-500 hover:bg-fuchsia-500 text-white" onClick={() => handleClick('search', value)}>Search</button>
                    <button className="!bg-gray-500/20 ml-4" onClick={() => handleClick('clear', value)}>Clear</button>
                </div>
                <div className="flex">
                    <div className="box-border w-screen h-[66.666vh] shadow-xl/30 bg-gray-500/10 rounded">
                        <DataList value={keyword} />
                    </div>
                </div>
            </div>

        </>
    )
}



export default FormSearch
