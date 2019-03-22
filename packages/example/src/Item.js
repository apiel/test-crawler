import React, { Component } from 'react';

import { data } from './data';

import './App.css';

const Item = ({ match }) => {
  const item = data[match.params.id];
  return (
    <div className="App">
      <h2>
        {item.name}
      </h2>
      {/* <img src={item.avatar} alt={item.name} /> */}
      <p>{item.text}</p>
      <p>{item.address}, {item.city}, {item.country}</p>
    </div>
  );
}

export default Item;

