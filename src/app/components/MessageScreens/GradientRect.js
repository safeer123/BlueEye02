import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const GradientRect = ({ classes, children }) =>
  (
    <div className={classes.root} >
      { children }
    </div>
  );

export default withStyles({
  root: {
    background: 'linear-gradient(45deg, #000000 30%, #213f6c 90%)',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})(GradientRect);
