
import { useEffect, useState } from "react";
import { getAll, type User } from './mock';

const log = console.log.bind('console')

function Empty() { return <p>No result for your search</p> }

function DataList() {
    // const cssText = 'mx-2 px-2 border border-dashed rounded'
    const [data, setData] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // 在 useEffect 中处理异步操作
    // API 请求是典型的副作用操作，所以大多数情况下应该写在 useEffect 中
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getAll();
                setData(res.data);
                setTotal(res.total);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // 或者添加实际依赖

    //  之前的 userMemo 是为了过滤保存和加载过后的数据
    // useMemo 用于性能优化，记忆化计算值


    const [scrollTop, setScrollTop] = useState(0);
    const itemHeight = 50;
    const containerHeight = 500;
    // 总高度 = 数据长度 * 每项高度

    const totalHeight = data.length * itemHeight;

    // 预计上下多渲染的 item 个数
    const overscan = 3
    // 计算当前应该显示的 item 的范围
    const caculator = () => {
        // startIndex        originalStart     absoluteIndex     originalStart          endIndex
        //           overscan                                                  overscan
        const originalStart = Math.floor(scrollTop / itemHeight)
        const visibleCount = Math.ceil(containerHeight / itemHeight)
        const originalEnd = Math.min(data.length - 1, originalStart + visibleCount)

        // 添加缓冲区
        const startIndex = Math.max(0, originalStart - overscan)
        const endIndex = Math.min(data.length - 1, originalEnd + overscan)

        return {
            startIndex,
            endIndex,
            originalStart,
            originalEnd
        }
    }

    const { startIndex, endIndex, originalStart, originalEnd } = caculator()
    const visibleData = data.slice(startIndex, endIndex + 1)

    // 监听滚动事件
    const handleScroll = (e: any) => {
        setScrollTop(e.target.scrollTop)
    };

    // 关键：计算偏移量，让可见项出现在正确位置
    const offsetY = startIndex * itemHeight

    if (loading) return <div>Loading...</div>;


    if (total === 0) {
        return (<Empty />)
    } else {
        return (
            <div className="w-4/5 mx-auto overflow-auto">
                <div className="my-4 grid grid-cols-4 gap-4 font-mono font-semibold">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Address</div>
                    <div>Phone</div>
                </div>
                <div className="overflow-auto border-indigo-500/20 border-t-1"
                    style={{ height: containerHeight }} onScroll={handleScroll}
                >
                    {/* 2. 占位容器 (Placeholder) - 用于撑开滚动条 */}
                    <div style={{ height: totalHeight }}>
                        {/*  真实列表 (Visible Items) - 绝对定位，只渲染可见部分 */}
                        <div style={{ transform: `translateY(${offsetY}px)` }}>
                            {
                                visibleData.map((e: any, index: number) => {
                                    // absoluteIndex -> 当前指向的 item 的绝对位置
                                    const absoluteIndex = startIndex + index;
                                    // originalStart -> 可视化区域的开始
                                    // originalEnd -> 可视区域结束
                                    const isInViewport = absoluteIndex >= originalStart && absoluteIndex <= originalEnd;
                                    return (
                                        <div key={e.id || absoluteIndex} className="grid grid-cols-4 gap-4 border-b-1 border-indigo-500/20 p-2"
                                            style={{ background: isInViewport ? 'white' : '#f9f9f9' }}>
                                            <div>{e.name}</div>
                                            <div>{e.email}</div>
                                            <div>{e.address}</div>
                                            <div>{e.phone}</div>
                                            {/* <span>{`Item ${absoluteIndex + 1}`}</span> */}
                                            {!isInViewport && ' (缓冲)'}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                {/* 调试信息 */}
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'white', padding: 8 }}>
                    <div>滚动位置: {Math.round(scrollTop)}px</div>
                    <div>显示范围: {startIndex} - {endIndex}</div>
                    <div>渲染项数: {visibleData.length}</div>
                </div>
            </div>
        )
    }
}

function FormScroll() {
    // scroll for 10W+ mock api or json
    // try the way for virtual form

    return (
        <>
            <div>
                <h1 className='bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent mb-15'>Virtual form scroll</h1>
                <div className="flex">
                    <div className="box-border w-screen h-[66.666vh] shadow-xl/30 bg-gray-500/10 rounded">
                        <DataList />
                    </div>
                </div>
            </div>

        </>
    )
}



export default FormScroll
