// pages/_app.js
import '../src/App.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps } />;
}