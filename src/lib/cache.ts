import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"


type Callback = (...args: any[]) => Promise<any>
type optProp = {
    revalidate?: number | false
    tags?: string[]
}
export const cache = <T extends Callback>(cb: T, keyParts: string[], options: optProp = {}) => {
    return nextCache(reactCache(cb), keyParts, options)
}