// pages/index.js
import dynamic from 'next/dynamic';

// Dynamically import the App component to prevent SSR issues
const App = dynamic(() => import('../src/App'), { ssr: false });

export default function Home() {
  return <App />;
}