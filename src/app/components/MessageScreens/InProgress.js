import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GradientRect from './GradientRect';

const InProgress = () => ({ classes }) =>
  (
    <GradientRect>
      <span className={classes.txt}>Dev in progress</span>
    </GradientRect>
  );

export default withStyles({
  txt: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
})(InProgress);

