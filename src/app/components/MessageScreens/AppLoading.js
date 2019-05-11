import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GradientRect from './GradientRect';

const AppLoading = ({ classes }) =>
  (
    <GradientRect>
      <img className={classes.logoImg} src="../../assets/images/SkyGATE Logo-01.png" alt="skygate logo" />
    </GradientRect>
  );

export default withStyles({
  txt: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
})(AppLoading);

