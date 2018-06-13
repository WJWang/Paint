import React from 'react';
import logo from './logo.svg';
import './App.css';
import ArtBoard from './artboard/index.jsx';

export default () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcomaaae to React</h1>
    </header>
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
      <ArtBoard />
    </p>
  </div>
);
