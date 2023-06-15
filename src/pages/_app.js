// src/pages/_app.js
import '../globals.css'  // adjust the path to your globals.css file

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
