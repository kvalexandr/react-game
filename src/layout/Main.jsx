import React, { Component } from 'react';
import { Cards } from '../components/Cards';
import { sizeField } from '../config/settings';

class Main extends Component {
  state = {
    size: sizeField[0]
  };

  render() {
    const { size } = this.state;

    return (
      <main className="content">
        <div className="game">
          <Cards size={size} />
        </div>
      </main>
    );
  }
}

export { Main };
