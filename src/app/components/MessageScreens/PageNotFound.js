import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GradientRect from './GradientRect';

const PageNotFound = ({ classes }) =>
  (
    <GradientRect>
      <p className={classes.txt}>
        Sorry..!<br />
        Requested Page Not Found <br />
        Would you like to visit home page ->
        <Button
          onClick={() => {
            window.location = '/';
          }}
          color="primary"
        >Click here
        </Button>
      </p>
    </GradientRect>
  );

export default withStyles({
  txt: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2064a9',
  },
})(PageNotFound);

