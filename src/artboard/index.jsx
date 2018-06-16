import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import ClickOutside from 'react-click-outside';
import GraffitiBoard from './graffitBoard.jsx';

const styles = {
  artBoardWrapper: {
    height: 800,
    width: 800,
    margin: '0 auto',
    border: 'solid 1px rgb(106, 106, 106)',
    borderRadius: '5px',
    backgroundColor: '#fff',
    position: 'relative',
  },
  controlPanelWrapper: {
    height: 50,
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: '5px 5px 0 0',
    border: 'none',
    padding: '5px 0',
    boxSizing: 'border-box',

    controlItem: {
      position: 'relative',
      height: '100%',
      width: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgb(50, 50, 50)',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      margin: 5,
      borderRadius: 5,
    },
    controlItemSelected: {
      color: 'rgb(244, 244, 244)',
      backgroundColor: 'rgb(62, 62, 62)',
    },
  },
};

class ArtBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultBoard: null,
      boardWidth: 800,
      boardHeight: 750,
      selectedTool: 'PENCILE',
      penColor: '#dc3545',
      layers: [],
      showPicker: false,
    };
  }

  componentDidMount() {
    this.initBoard();
  }

  setTool = tool => (e) => {
    e.preventDefault();
    this.setState({
      selectedTool: tool,
    });
  }

  initBoard = () => {
    this.setState({
      resultBoard: document.querySelector('#resultBoard'),
    });
  }

  saveLayer = (layer) => {
    this.setState({
      layers: [
        ...this.state.layers,
        {
          id: (this.state.layers.length) ? this.state.layers.length + 1 : 1,
          ...layer,
        },
      ],
    }, () => {
      this.drawResult();
    });
  }

  deleteLayer = layerId => (e) => {
    e.preventDefault();
    this.setState({
      layers: this.state.layers.filter(layer => layer.id !== layerId),
    }, () => {
      this.clearBoard();
      this.drawResult();
    });
  }

  clearBoard = () => {
    const { resultBoard } = this.state;
    resultBoard
      .getContext('2d')
      .clearRect(0, 0, resultBoard.width, resultBoard.height);
  }

  clearResult = () => {
    this.setState({
      layers: [],
    }, () => {
      this.clearBoard();
    });
  }

  drawPath = ({
    paths = [],
    stroke = document.querySelector('#resultBoard').getContext('2d'),
  }) => {
    paths.forEach((point, idx) => {
      if (idx === 0) {
        stroke.beginPath();
        stroke.moveTo(point.x, point.y);
      } else {
        stroke.lineTo(point.x, point.y);
        stroke.stroke();
      }
    });
  }

  drawRect = ({
    rect = {
      x: 0, y: 0, w: 0, h: 0,
    },
    stroke = document.querySelector('#resultBoard').getContext('2d'),
  }) => {
    if (rect && 'x' in rect && 'y' in rect && 'w' in rect && 'h' in rect) {
      stroke.strokeRect(rect.x, rect.y, rect.w, rect.h);
    }
  }

  drawResult = () => {
    const { layers, resultBoard } = this.state;
    const stroke = resultBoard.getContext('2d');

    layers.forEach((layer) => {
      stroke.strokeStyle = layer.color;
      if (layer.type === 'PENCILE') {
        this.drawPath({ paths: layer.path, stroke });
      }
      if (layer.type === 'RECTANGLE') {
        this.drawRect({ rect: layer.path, stroke });
      }
    });
  }

  render() {
    const {
      selectedTool, boardWidth, boardHeight, layers, penColor, showPicker,
    } = this.state;
    const itemSelectedStyle = item => (
      item === selectedTool ? styles.controlPanelWrapper.controlItemSelected : {}
    );
    return (
      <div style={styles.artBoardWrapper}>
        <div style={styles.controlPanelWrapper}>
          <button
            onClick={this.setTool('PENCILE')}
            style={{
              ...styles.controlPanelWrapper.controlItem,
              ...itemSelectedStyle('PENCILE'),
            }}>
            <i className="material-icons">edit</i>
          </button>

          <button
            onClick={this.setTool('ADD_IMAGE')}
            style={{
              ...styles.controlPanelWrapper.controlItem,
              ...itemSelectedStyle('ADD_IMAGE'),
            }}>
            <i className="material-icons">add_photo_alternate</i>
          </button>

          <button
            onClick={this.setTool('RECTANGLE')}
            style={{
              ...styles.controlPanelWrapper.controlItem,
              ...itemSelectedStyle('RECTANGLE'),
            }}>
            <i className="material-icons">crop_din</i>
          </button>

          <button
            onClick={this.clearResult}
            style={{
              ...styles.controlPanelWrapper.controlItem,
            }}>
            <i className="material-icons">close</i>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                showPicker: true,
                selectedTool: 'COLOR_PICKER',
              });
            }}
            style={{
              ...styles.controlPanelWrapper.controlItem,
              height: 35,
              width: 35,
              backgroundColor: `${this.state.penColor}`,
              zIndex: 100000,
            }}>
            {
              (showPicker) && (
                <ClickOutside
                  onClickOutside={() => {
                    this.setState({
                      showPicker: false,
                      selectedTool: 'PENCILE',
                    });
                  }}>
                  <SketchPicker
                    color={this.state.penColor}
                    onChangeComplete={(color) => {
                      this.setState({
                        penColor: color.hex,
                      });
                    }} />
                </ClickOutside>
              )
            }
          </button>

        </div>
        <canvas
          id="resultBoard"
          width={boardWidth}
          height={boardHeight}
          style={{
            top: 50,
            left: 0,
            position: 'absolute',
          }} />

        {
          (!~['RECTANGLE', 'PENCILE'].indexOf(selectedTool)) ? (
            <div
              style={{
                zIndex: 100,
                position: 'relative',
                backgroundColor: 'transparent',
                cursor: 'crosshair',
                width: `${boardWidth}px`,
                height: `${boardHeight}px`,
              }} />
          ) : (
            <GraffitiBoard
              penColor={penColor}
              selectedTool={selectedTool}
              boardWidth={boardWidth}
              boardHeight={boardHeight}
              save={this.saveLayer} />
          )
        }

        {
          (layers.length) ? (
            <div style={{
              width: '100%', padding: 5, boxSizing: 'border-box',
            }}>
              <h2>Steps</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Layer type</th>
                    <th>Color</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    layers.map((layer, idx) => (
                      <tr>
                        <td>
                          { idx + 1 }
                        </td>
                        <td>
                          { layer.type }
                        </td>
                        <td>
                          <div style={{
                            backgroundColor: `${layer.color}`,
                            width: 20,
                            height: 20,
                          }} />
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ display: 'flex', alignItems: 'center' }}
                            onClick={this.deleteLayer(layer.id)}>
                            <i className="material-icons" style={{ fontSize: 12 }}>close</i>
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default ArtBoard;
