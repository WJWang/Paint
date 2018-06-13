import React, { Component } from 'react';

import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

class ArtBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: null,
    };
  }

  componentDidMount() {
    range(1, 200)
      .pipe(filter(x => x % 2 === 1), map(x => x + x))
      .subscribe(x => this.setVal(x));
  }

  setVal = (val) => {
    this.setState({
      count: val,
    });
  }

  render() {
    const { count } = this.state;
    return (
      <div>
        This is ArtBoard.
        { count }
      </div>
    );
  }
}

export default ArtBoard;
