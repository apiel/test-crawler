import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { data } from './data';

import './App.css';

const List = () => (
  <div className="App">
    <header className="App-header">
      <h1>The awesome app</h1>
      {data.map((item, index) => (
        <div key={index}>
          <h2>
            <Link to={{ pathname: `/item/${index}` }}>
              {item.name}
            </Link>
          </h2>
          {/* <img src={item.avatar} alt={item.name} /> */}
          <p>{item.text}</p>
          <Link to={{ pathname: `/item/${index}` }}>link</Link>
          <p>{Math.random()}</p>
        </div>
      ))}
    </header>
    <p>Bottom of the page</p>
  </div>
);

export default List;
