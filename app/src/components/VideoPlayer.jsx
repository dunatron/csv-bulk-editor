import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import VideoPlayerControls from './VideoPlayerControls';


const styles = theme => ({
  card: {
    display: 'flex',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
});

class VideoPlayer extends Component {

  constructor(props) {
    super(props);
  }

  playVideo() {
    // You can use the play method as normal on your video ref
    this.refs.vidRef.play();
  }

  pauseVideo() {
    // Pause as well
    this.refs.vidRef.pause();
  }

  render = () => {
    const { classes, theme, src } = this.props;

    return (
      <div>
        {/*<video src="https://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4"></video>*/}
        {/*<video src={src} type="video/mp4"></video>*/}
        <VideoPlayerControls playVideo={this.playVideo.bind(this)} pauseVideo={this.pauseVideo.bind(this)} />
        <video ref="vidRef" width="320" height="240" controls>
          <source src={src} type="video/mp4" />
        </video>
        {/*<CardMedia*/}
        {/*//className={classes.cover}*/}
        {/*src="https://clips.vorwaerts-gmbh.de/VfE_html5.mp4"*/}
        {/*//title="Live from space album cover"*/}
        {/*//src={<video src={src} type="video/mp4"></video>}*/}
        {/*//<video src="https://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4"></video>*/}
        {/*/>*/}
      </div>
    )
  }


}

VideoPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(VideoPlayer);