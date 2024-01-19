// src/GlobalStyles.js

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: var(--bg-body-color);

  }

  /* Add any additional global styles here */
`;

export default GlobalStyles;
