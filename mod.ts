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
    while (children.length >= 0) {
        console.log(children)
        let next: T | undefined = undefined
        const toYield: T[] = []
        control({
            current,

            getState: () => state,
            setState: (s: S) => state = s,

            getChildren: () => children,
            setChildren: (t: T[]) => children = t,

            terminate: () => next = undefined,
            send: (v: T) => toYield.push(v),

            select: (index: number) => {
                next = children.splice(index, 1)[0]
            }
        })

        yield* toYield
        if (next == undefined) {
            return
        } else {
            yield* c(
                control,
                next,
                state
            )
        }    
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

;