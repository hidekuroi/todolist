import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import store from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';


export let rerenderEntireTree = (reduxStore = store) => {
    ReactDOM.render(
      <BrowserRouter>
        <Provider store={reduxStore}>
          <App />
        </Provider>
      </BrowserRouter>,
      document.getElementById('root')
    );
  }

  
rerenderEntireTree();

store.subscribe(() => {rerenderEntireTree()});