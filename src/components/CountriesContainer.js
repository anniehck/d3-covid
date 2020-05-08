import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import DateFnsUtils from '@date-io/date-fns';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import TopoMap from './TopoMap';
import Datatable from './Datatable';
import ChartContainer from './ChartContainer';

export default function CountriesContainer() {
    const dateUtils = new DateFnsUtils(),
        [summary, setSummary] = useState({ 'Global': {}, 'Countries': [] });

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

            <ChartContainer data={summary.Countries} />

            <Datatable
                title="COVID-19 Data for All Countries"
                headerNames={['Country', 'NewConfirmed', 'TotalConfirmed', 'NewDeaths', 'TotalDeaths', 'NewRecovered', 'TotalRecovered']}
                data={summary.Countries}
                orderByHeader="TotalConfirmed" />
        </div>
    );
}