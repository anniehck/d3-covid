import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import DateFnsUtils from '@date-io/date-fns';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { STATES_MAPPING } from '../data/us-states-mapping';
import ChartContainer from './ChartContainer';
import Datatable from './Datatable';
import { TabPanel, getTabProps } from './TabPanel';
import { parseIntData, parseFloatData } from './utils/FormatUtils';


export default function USContainer() {
    const dateUtils = new DateFnsUtils(),
        yesterdayDate = dateUtils.addDays(new Date(), -1),
        [chartData, setChartData] = useState([]),
        [tableData, setTableData] = useState([]),
        [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newTab) => setActiveTab(newTab);

    const formatChartData = (res) => {
        const data = res.map((state) => {
            const numbers = parseIntData({
                Active: state.Active,
                Confirmed: state.Confirmed,
                Deaths: state.Deaths,
                Recovered: state.Recovered
            });

            return {
                code: STATES_MAPPING[state.Province_State],
                Active: numbers.Active,
                Confirmed: numbers.Confirmed,
                Deaths: numbers.Deaths,
                Recovered: numbers.Deaths,
                Total: numbers.Active + numbers.Confirmed + numbers.Deaths + numbers.Recovered,
            };
        });

        return data.filter(d => d.code);
    };

    const formatTableData = (res) => {
        return res.map((state) => {
            const numbers = parseIntData({
                Active: state.Active,
                Confirmed: state.Confirmed,
                Deaths: state.Deaths,
                Recovered: state.Recovered,
                PeopleHospitalized: state.People_Hospitalized,
                PeopleTested: state.People_Tested
            }),
                floats = parseFloatData({
                    HospitalizationRate: state.Hospitalization_Rate,
                    IncidentRate: state.Incident_Rate,
                    MortalityRate: state.Mortality_Rate,
                    TestingRate: state.Testing_Rate
                });
            
            return {
                State: state.Province_State,
                Active: numbers.Active,
                Confirmed: numbers.Confirmed,
                Deaths: numbers.Deaths,
                Recovered: numbers.Recovered,
                HospitalizationRate: floats.HospitalizationRate,
                IncidentRate: floats.IncidentRate,
                MortalityRate: floats.MortalityRate,
                PeopleHospitalized: numbers.PeopleHospitalized,
                PeopleTested: numbers.PeopleTested,
                TestingRate: floats.TestingRate
            };
        });
    }

    useEffect(() => {
        const yesterday = dateUtils.format(yesterdayDate, 'MM-dd-yyyy'),
            url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/${yesterday}.csv`;

        d3.csv(url)
            .then(res => {
                setChartData(formatChartData(res));
                setTableData(formatTableData(res));
            })
            .catch(err => console.warn('Oh no! something horrrible happened....'));
    }, []);

    const headerNames = [
        'State', 'Active', 'Confirmed', 'Deaths', 'Recovered', 'HospitalizationRate',
        'IncidentRate', 'MortalityRate', 'PeopleHospitalized', 'PeopleTested', 'TestingRate'
    ];

    return (
        <div style={{ paddingTop: '2em', width: '85%' }}>
            <Paper style={{ width: '65%', margin: '0 auto', marginBottom: '2em', padding: '15px 0' }}>
                <Typography variant="h4">
                    COVID-19 Cases &nbsp; <code>{dateUtils.format(yesterdayDate, 'MMM do yyyy')}</code>
                </Typography>
            </Paper>
            <div style={{ flexGrow: 1 }}>
                <AppBar position="static" color="transparent" elevation={0}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="data tabs"
                        indicatorColor="primary"
                        textColor="primary"
                        centered>
                        <Tab label="Chart" {...getTabProps(0)} />
                        <Tab label="Datatable" {...getTabProps(1)} />
                    </Tabs>
                </AppBar>

                <TabPanel value={activeTab} index={0}>
                    <ChartContainer data={chartData} chartType="radial" />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <Datatable
                        title="COVID-19 Data for US"
                        headerNames={headerNames}
                        data={tableData}
                        orderByHeader="Confirmed" />
                </TabPanel>
            </div>
        </div>
    );
}