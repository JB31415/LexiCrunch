import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import TweenOne from 'rc-tween-one';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
    };
  }

  onClick = () => {
    this.setState({
      paused: false,
    });
  };

  onPause = () => {
    this.setState({
      paused: true,
    });
  };

  render() {
    const fallingBlockAnimation = {
      top: '500px', // End position from the top
      duration: 2000, // Duration of the animation in milliseconds
      repeat: 0, // Number of times the animation should repeat (0 for no repeat)
    };

    return (
      <div style={{ position: 'relative', height: '500px' }}>
        <TweenOne
          animation={this.state.paused ? null : fallingBlockAnimation}
          paused={this.state.paused}
          className="code-box-shape"
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            background: 'blue',
          }}
        />
        <div className="demo-buttons" style={{ position: 'absolute', bottom: '20px', left: '50%' }}>
          <Button type="primary" onClick={this.onClick}>
            Play
          </Button>
          <Button type="primary" onClick={this.onPause}>
            Pause
          </Button>
        </div>
      </div>
    );
  }
}

Demo.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  paused: PropTypes.bool,
};

export default Demo;