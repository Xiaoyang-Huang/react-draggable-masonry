import { createContext } from "react"

export type Config = {
    bounded: boolean
}
export const ConfigContext = createContext<Config>({
    bounded: false
})
