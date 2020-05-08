import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import DateFnsUtils from '@date-io/date-fns';
import startCase from 'lodash/startCase';

import FormContainer from './FormContainer';
import Datatable from './Datatable';
import TopoMap from './TopoMap';


const DATE_FORMAT = `yyyy-MM-dd'T'HH:mm:ss'Z'`;

export default function CountryContainer() {
    const dateUtils = new DateFnsUtils(),
        [country, setCountry] = useState(''),
        [countryData, setCountryData] = useState([]),
        [startDate, setStartDate] = useState(dateUtils.addDays(new Date(), -5)),
        [endDate, setEndDate] = useState(new Date()),
        [enableSubmit, setEnableSubmit] = useState(false),
        [topoMap, setTopoMap] = useState(<div/>);

    const handleInputChange = (event) => {
        setCountry(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formattedStartDate = dateUtils.format(startDate, DATE_FORMAT),
            formattedEndDate = dateUtils.format(endDate, DATE_FORMAT),
            url = `https://api.covid19api.com/country/${country}?from=${formattedStartDate}&to=${formattedEndDate}`;

        d3.json(url)
            .then(res => {
                const countryData = res.map(r => {
                    const parsedDate = dateUtils.parse(r.Date, DATE_FORMAT);
                    return {
                        date: dateUtils.format(parsedDate, 'yyyy-MM-dd'),
                        active: r.Active,
                        confirmed: r.Confirmed,
                        deaths: r.Deaths,
                        recovered: r.Recovered
                    };
                });

                setCountryData(countryData);
                setTopoMap(<TopoMap data={countryData} mapType="country" country={country} />);
            })
            .catch(err => alert('Oh no! something horrrible happened....'));
    };

    useEffect(() => {
        if (country) {
            setTopoMap(<div/>);
            setCountry(country);
            setEnableSubmit(true);
        }
    }, [country]);

    return (
        <>
            <FormContainer
                country={country}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleFormSubmit={handleFormSubmit}
                handleInputChange={handleInputChange}
                enableSubmit={enableSubmit} />
            <div style={{ paddingTop: '2em', width: '100%' }}>
            {countryData.length
                ? <Datatable
                    title={'COVID-19 Data for ' + startCase(country)}
                    orderByHeader="date"
                    headerNames={['active', 'confirmed', 'deaths', 'recovered', 'date']}
                    data={countryData}
                    numRowsPerPage={10} />
                : <div/>}
            </div>
        </>
    );
}