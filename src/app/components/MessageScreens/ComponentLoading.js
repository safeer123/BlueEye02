import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const ComponentLoading = ({ classes, imgHeight, showText }) =>
  (
    <div className={classes.root}>
      {
        showText &&
        <span className={classes.txt}>{showText}</span>
      }
      {
          !showText &&
          <img
            src="../../assets/images/loader.svg"
            alt="loader"
            className={classes.loaderImg}
            style={{ height: imgHeight }}
          />
      }
    </div>
  );

export default withStyles({
  root: {
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
  txt: {
    fontSize: '12px',
    color: '#2064a9',
  },
  loaderImg: {

  },
})(ComponentLoading);

