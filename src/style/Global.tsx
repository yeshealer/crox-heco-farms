import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from 'crox-new-uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    // font-family: 'Kanit', sans-serif;
    font-family: 'Baloo 2', cursive;
  }
  body {
    background-color: #1a1b23;

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
