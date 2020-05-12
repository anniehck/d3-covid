import React from 'react';
import { Link as RouterLink } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    topLink: {
        width: '50%',
        display: 'flex',
        justifyContent: 'space-around'
    }
}));

export default function Main() {
    const classes = useStyles();
      return (
          <div className={classes.topLink}>
              <Button color="primary" component={RouterLink} to="/search-country">
                  Search by Country
              </Button>
              <Button color="primary" component={RouterLink} to="/united-states">
                  US Data
              </Button>
              <Button color="primary" component={RouterLink} to="/countries">
                  All Country Data
              </Button>
          </div>
      );
}

