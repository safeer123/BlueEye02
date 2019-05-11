import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GradientRect from './GradientRect';

const ErrorMsg = ({ classes }) =>
  (
    <GradientRect>
      <p className={classes.txt}>
        Something broke in the app.<br />
        Could you please help us with more details.
      </p>
    </GradientRect>
  );

export default withStyles({
  txt: {
    fontSize: '18px',
    color: '#2064a9',
  },
})(ErrorMsg);

