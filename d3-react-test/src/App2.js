import React from 'react';
import MyD3Chart from './components/MyD3Chart';

function App2() {
  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 id ="chartTitle">Coverage Chart</h1>
      <p id="description">This is a chart showing the samples that are above minimum coverage and those that are below.</p>
      <MyD3Chart id="chart" />
    </div>
  );
}

export default App2;