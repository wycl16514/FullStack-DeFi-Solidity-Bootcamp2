import logo from './logo.svg';
import './App.css';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from './components/wallet';
import Layout from './components/Layout';
import "semantic-ui-css/semantic.min.css"

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <Layout></Layout>
      </div>
    </Web3ReactProvider>

  );
}

export default App;
