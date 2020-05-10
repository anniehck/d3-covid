import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import DateFnsUtils from '@date-io/date-fns';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


import TopoMap from './TopoMap';
import Datatable from './Datatable';
import ChartContainer from './ChartContainer';


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  debugger
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={10}>{children}</Box>
      )}
    </div>
  );
}

function getTabProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function CountriesContainer() {
    const dateUtils = new DateFnsUtils(),
        [summary, setSummary] = useState({ 'Global': {}, 'Countries': [] }),
        [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newTab) => setActiveTab(newTab);

    useEffect(() => {
        if (!summary.Countries.length) {
            d3.json('https://api.covid19api.com/summary')
                .then(res => {
                    setSummary(res);
                })
                .catch(err => console.log('Failed to get summary'));
        }

    }, [summary])

    return (
        <div style={{ paddingTop: '2em' }}>
            <Paper style={{ marginBottom: '2em', padding: '15px 0' }}>
                <Typography variant="h4">
                    COVID-19 Cases &nbsp; <code>{dateUtils.format(new Date(), 'MMM do yyyy')}</code>
                </Typography>
            </Paper>
            <div style={{ flexGrow: 1 }}>
                <AppBar position="static" color="transparent" elevation={0}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="simple tabs example"
                        indicatorColor="primary"
                        textColor="primary"
                        centered>
                        <Tab label="Chart" {...getTabProps(0)} />
                        <Tab label="Datatable" {...getTabProps(1)} />
                    </Tabs>
                </AppBar>

                <TabPanel value={activeTab} index={0}>
                    <ChartContainer data={summary.Countries} chartType="bubble" />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <Datatable
                        title="COVID-19 Data for All Countries"
                        headerNames={['Country', 'NewConfirmed', 'TotalConfirmed', 'NewDeaths', 'TotalDeaths', 'NewRecovered', 'TotalRecovered']}
                        data={summary.Countries}
                        orderByHeader="TotalConfirmed" />
                </TabPanel>
            </div>
        </div>
    );
}