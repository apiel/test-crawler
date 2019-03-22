import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './App.css';
import List from './List';
import Item from './Item';

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={List} />
      <Route path="/item/:id" component={Item} />
    </div>
  </Router>
);

export default AppRouter;
