import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({

  logo: {
    fontSize: 30,
  },
});

const LogoIcon = () => {
  const classes = useStyles();

  return (
    <div className={classes.logo}>
      🍊
    </div>
  );
};

export default LogoIcon;
