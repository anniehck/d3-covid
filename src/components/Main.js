import React from 'react';
import { Link as RouterLink } from 'react-router-dom'
import Button from '@material-ui/core/Button';

export default function Main() {
      return (
          <div>
              <Button color="primary" component={RouterLink} to="/search-country">
                  Search by Country
              </Button>
              <Button color="primary" component={RouterLink} to="/countries">
                  All Country Data
              </Button>
          </div>
      );
}

