import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import DateFnsUtils from '@date-io/date-fns';
import find from 'lodash/find';

import { STATES_MAPPING } from '../data/us-states-mapping';
import ChartContainer from './ChartContainer';
import Datatable from './Datatable';


const DATE_FORMAT = `yyyy-MM-dd'T'HH:mm:ss'Z'`;

export default function USContainer() {
    const dateUtils = new DateFnsUtils(),
        [usData, setUsData] = useState([]);

    useEffect(() => {
        const yesterday = dateUtils.format(dateUtils.addDays(new Date(), -1), 'MM-dd-yyyy'),
            url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/${yesterday}.csv`;

        d3.csv(url)
            .then(res => {
                const data = res.map((state) => {
                    const Active = state.Active ? parseInt(state.Active, 10) : 0,
                        Confirmed = state.Confirmed ? parseInt(state.Confirmed, 10) : 0,
                        Deaths = state.Deaths ? parseInt(state.Deaths, 10) : 0,
                        Recovered = state.Recovered ? parseInt(state.Recovered, 10) : 0;
                    return {
                        code: STATES_MAPPING[state.Province_State],
                        Active,
                        Confirmed,
                        Deaths,
                        Recovered,
                        Total: Active + Confirmed + Deaths + Recovered,
                    };
                });
                console.log(data)
                setUsData(data.filter(d => d.code));
            })
            .catch(err => console.warn('Oh no! something horrrible happened....'));
    }, []);

    return (
        <div style={{ width: '75%', paddingTop: '2em' }}>
            <ChartContainer data={usData} chartType="radial" />
            <Datatable
                title="COVID-19 Data for US"
                headerNames={['Active', 'Confirmed', 'Deaths', 'Recovered', 'Total']}
                data={usData.slice(0,1)}
                orderByHeader="Total" />
        </div>
    );
}

// <div style={{ paddingTop: '2em', width: '100%' }}>
// {countryData.length
//     ? <Datatable
//         title={'COVID-19 Data for ' + startCase(country)}
//         orderByHeader="date"
//         headerNames={['active', 'confirmed', 'deaths', 'recovered', 'date']}
//         data={countryData}
//         numRowsPerPage={10} />
//     : <div/>}
// </div>