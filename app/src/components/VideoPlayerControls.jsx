import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import SkipPreviousIcon from 'material-ui-icons/SkipPrevious';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import SkipNextIcon from 'material-ui-icons/SkipNext';


const styles = theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
});

// You can then call the parent play/pause methods from your child component.
class VideoPlayerControls extends Component {
  render(){
    const { classes } = this.props;
    return(
      <div>
        <div className={classes.controls}>
          <IconButton id='playButton' aria-label="Play/pause" onClick={this.props.playVideo}>
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
          <IconButton id='pauseButton' aria-label="Play/pause" onClick={this.props.pauseVideo}>
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(VideoPlayerControls);