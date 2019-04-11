/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { render } from 'react-dom';
import { createStore } from './components/RabbleX/index';

const root = document.getElementById('root');

const [CountContext, CountProvider] = createStore({
    count: 0,
    increment() {
        this.count++;
    },
});
function App() {
    return (
        <CountProvider>
            <Counter />
        </CountProvider>
    );
}

function Counter() {
    const { count, increment } = React.useContext(CountContext);
    return <button onClick={increment}>Clicked: {count}</button>;
}

render(<App />, root);
