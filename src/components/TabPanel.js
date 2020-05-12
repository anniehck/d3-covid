import React from 'react';
import Box from '@material-ui/core/Box';

export function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`data-tabpanel-${index}`}
        aria-labelledby={`data-tab-${index}`}
        style={{ width: '100%' }}
        {...other}>
        {value === index && (
          <Box p={6}>{children}</Box>
        )}
      </div>
    );
}
  
export function getTabProps(index) {
    return {
        id: `data-tab-${index}`,
        'aria-controls': `data-tabpanel-${index}`
    };
}