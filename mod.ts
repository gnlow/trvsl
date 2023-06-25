interface ControlOp<T, S> {
    current: T

    getState: () => S
    setState: (s: S) => void

    getChildren: () => T[]
    setChildren: (t: T[]) => void

    terminate: () => void
    send: (v: T) => void

    select: (index: number) => void
}

function* c<T, S>(
    control: (option: ControlOp<T, S>) => void,
    current: T,
    state: S,
    children: T[] = [],
): Generator<T, undefined, undefined> {
    let next: number | undefined = undefined
    const toYield: T[] = []
    control({
        current,

        getState: () => state,
        setState: (s: S) => state = s,

        getChildren: () => children,
        setChildren: (t: T[]) => children = t,

        terminate: () => next = undefined,
        send: (v: T) => toYield.push(v),

        select: (index: number) => next = index
    })

    yield* toYield
    if (next == undefined || children.length == 0) {
        return
    } else {
        yield* c(
            control,
            children[next],
            state,
            children.toSpliced(next, 1)
        )
    }
}

console.log([...c(
    ({ current, getChildren, send, select }) => {
        console.log(current)
        send(current * 2)

        select(0)
    },
    0,
    0 as number,
    [1, 2]
)])