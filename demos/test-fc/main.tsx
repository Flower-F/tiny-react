import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div>
      <Child />
    </div>
  );
}

function Child() {
  return (
    <div>
      <span>big react!</span>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
