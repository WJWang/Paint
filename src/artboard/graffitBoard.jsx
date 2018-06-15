import React, { Component } from 'react';
import radium from 'radium';
import PropTypes from 'prop-types';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

const styles = {
  graffitiBoardWrapper: {
    zIndex: 100,
    position: 'relative',
    backgroundColor: 'transparent',
    cursor: 'crosshair',
  },
  canvas: {
    top: 0,
    left: 0,
    position: 'absolute',
  },
};

const coordinateConvert = (e) => {
  e.preventDefault();
  return {
    x: e.offsetX,
    y: e.offsetY,
  };
};

class GraffitiBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graffitiBoard: null,
      mouseDowns: null,
      mouseUps: null,
      mouseMoves: null,
      draw: false,
      stroke: null,
      initX: null,
      initY: null,
      trace: {
        path: [],
      },
    };
  }

  componentDidMount() {
    this.initBoard({});
  }

  drawMouseStart = (coordinate) => {
    const { x, y } = coordinate;
    const { selectedTool } = this.props;
    this.setState({
      draw: true,
      initX: x,
      initY: y,
    }, () => {
      const {
        stroke, graffitiBoard, initX, initY,
      } = this.state;
      const { penColor, lineWidth } = this.props;
      stroke.lineWidth = lineWidth;
      stroke.strokeStyle = penColor;

      let o = graffitiBoard;
      graffitiBoard.offsetX = graffitiBoard.offsetLeft;
      graffitiBoard.offsetY = graffitiBoard.offsetTop;
      while (o.offsetParent) {
        o = o.offsetParent;
        graffitiBoard.offsetX += o.offsetLeft;
        graffitiBoard.offsetY += o.offsetTop;
      }

      if (selectedTool === 'PENCILE') {
        stroke.beginPath();
        stroke.moveTo(initX, initY);
      }
    });
  }

  mouseDrawing = (coordinate) => {
    const { x, y } = coordinate;
    const { selectedTool } = this.props;
    const {
      draw, stroke, initX, initY,
    } = this.state;

    if (draw && selectedTool === 'PENCILE') {
      const path = { x, y };
      stroke.lineTo(x, y);
      stroke.stroke();
      this.setState({
        trace: {
          ...this.state.trace,
          path: [
            ...this.state.trace.path,
            path,
          ],
        },
      });
    }

    if (draw && selectedTool === 'RECTANGLE') {
      this.clear();
      const path = {
        x: (initX <= x) ? initX : x,
        y: (initY <= y) ? initY : y,
        w: Math.abs(x - initX),
        h: Math.abs(y - initY),
      };
      stroke.strokeRect(path.x, path.y, path.w, path.h);

      this.setState({
        trace: {
          ...this.state.trace,
          path: [
            ...this.state.trace.path,
            path,
          ],
        },
      });
    }
  }

  drawEnd = () => {
    const { trace } = this.state;
    const { selectedTool } = this.props;
    if (selectedTool === 'RECTANGLE') {
      this.props.save({
        type: 'RECTANGLE',
        path: (trace.path.length) ? trace.path[trace.path.length - 1] : null,
      });
    }

    if (selectedTool === 'PENCILE') {
      this.props.save({
        type: 'PENCILE',
        path: trace.path,
      });
    }

    this.clear();
    this.setState({
      draw: false,
      trace: {
        path: [],
      },
    });
  }

  clear = () => {
    const { graffitiBoard } = this.state;
    graffitiBoard
      .getContext('2d')
      .clearRect(0, 0, graffitiBoard.width, graffitiBoard.height);
  }

  initBoard = () => {
    const { boardHeight, boardWidth } = this.props;
    const graffitiBoard = document.querySelector('#graffitiBoard');
    graffitiBoard.width = boardWidth;
    graffitiBoard.height = boardHeight;

    this.setState({
      graffitiBoard,
      stroke: graffitiBoard.getContext('2d'),
      mouseDowns: fromEvent(graffitiBoard, 'mousedown').pipe(map(coordinateConvert)),
      mouseMoves: fromEvent(graffitiBoard, 'mousemove').pipe(map(coordinateConvert)),
      mouseUps: fromEvent(graffitiBoard, 'mouseup').pipe(map(coordinateConvert)),
    }, () => {
      const { mouseDowns, mouseMoves, mouseUps } = this.state;
      mouseDowns.forEach(this.drawMouseStart);
      mouseMoves.forEach(this.mouseDrawing);
      mouseUps.forEach(this.drawEnd);
    });
  }

  render() {
    const { boardWidth, boardHeight } = this.props;
    const wrapperStyle = {
      ...styles.graffitiBoardWrapper,
      width: `${boardWidth}px`,
      height: `${boardHeight}px`,
    };
    return (
      <div
        className="graffitiBoard-wrapper"
        style={wrapperStyle}>
        <canvas id="graffitiBoard" style={styles.canvas} />
      </div>
    );
  }
}

GraffitiBoard.propTypes = {
  boardWidth: PropTypes.number,
  boardHeight: PropTypes.number,
  penColor: PropTypes.string,
  lineWidth: PropTypes.number,
  selectedTool: PropTypes.string,
  save: PropTypes.func,
  close: PropTypes.func,
};

GraffitiBoard.defaultProps = {
  boardWidth: 300,
  boardHeight: 300,
  penColor: '#000',
  lineWidth: 1,
  selectedTool: 'PENCILE',
  save: (file) => {
    console.log(file);
  },
  close: () => {
    console.log('close click');
  },
};

export default radium(GraffitiBoard);
