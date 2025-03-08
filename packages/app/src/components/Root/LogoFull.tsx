import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 30,
  },
  path: {
    fill: '#7df3e1',
  },
  text: {
    color: 'rgb(242, 133, 0)',
    fontSize: 30,
    fontFamily: 'sans-serif',
  },
});
const LogoFull = () => {
  const classes = useStyles();

  return (
    <div className={classes.text}>
      <table>
        <tr>
          <td>🍊</td>
          <td>Tangerine</td>
        </tr>
      </table>
    </div>
  );
};

export default LogoFull;
