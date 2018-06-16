import React, { Component } from 'react';
import radium from 'radium';
import PropTypes from 'prop-types';

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

class GraffitiBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graffitiBoard: null,
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

  drawMouseStart = (e) => {
    const { selectedTool } = this.props;
    this.setState({
      draw: true,
      stroke: this.state.graffitiBoard.getContext('2d'),
      initX: e.pageX - this.state.graffitiBoard.offsetX,
      initY: e.pageY - this.state.graffitiBoard.offsetY,
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

  mouseDrawing = (e) => {
    const { selectedTool } = this.props;
    const {
      draw, stroke, graffitiBoard, initX, initY,
    } = this.state;
    const curX = e.pageX - graffitiBoard.offsetX;
    const curY = e.pageY - graffitiBoard.offsetY;

    if (draw && selectedTool === 'PENCILE') {
      const path = { x: curX, y: curY };
      stroke.lineTo(curX, curY);
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
        x: (initX <= curX) ? initX : curX,
        y: (initY <= curY) ? initY : curY,
        w: Math.abs(curX - initX),
        h: Math.abs(curY - initY),
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

  drawEnd = (e) => {
    const { trace } = this.state;
    const { selectedTool } = this.props;
    e.preventDefault();
    if (selectedTool === 'RECTANGLE') {
      this.props.save({
        type: 'RECTANGLE',
        color: this.props.penColor,
        path: (trace.path.length) ? trace.path[trace.path.length - 1] : null,
      });
    }

    if (selectedTool === 'PENCILE') {
      this.props.save({
        type: 'PENCILE',
        color: this.props.penColor,
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
    const { boardWidth, boardHeight } = this.props;
    const graffitiBoard = document.querySelector('#graffitiBoard');
    graffitiBoard.width = boardWidth;
    graffitiBoard.height = boardHeight;
    this.setState({
      graffitiBoard,
    }, () => {
      const eventList = {
        mousedown: this.drawMouseStart,
        mousemove: this.mouseDrawing,
        mouseup: this.drawEnd,
        touchstart: this.drawTouchStart,
        touchmove: this.touchDrawing,
        touchend: this.drawEnd,
      };
      Object
        .keys(eventList)
        .forEach(key => this.state.graffitiBoard.addEventListener(key, eventList[key]));
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
