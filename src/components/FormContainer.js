import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import sortBy from 'lodash/sortBy';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles({
    form: {
        width: '50%',
        textAlign: 'left'
    },
    formControl: {
        width: '100%',
        marginTop: '1em'
    },
    formDatepickers: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    datepickerEl: {
        marginTop: 20,
        width: '48%'
    },
    formElement: {
        marginTop: 20
    }
});

export default function FormContainer(props) {
    const dateUtils = new DateFnsUtils(),
        [countryOptions, setCountryOptions] = useState([]),
        classes = useStyles();

    useEffect(() => {
        if (!countryOptions.length) {
            d3.json(`https://api.covid19api.com/countries`)
                .then(res => {
                    const options = sortBy(res, 'Slug').map((country) => {
                        return (
                            <MenuItem value={country.Slug} key={country.ISO2}>{country.Country}</MenuItem>
                        );
                    });
                    setCountryOptions(options);
                });
        }
    }, [countryOptions])

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <form className={classes.form} onSubmit={props.handleFormSubmit}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                        labelId="country-label"
                        value={props.country}
                        onChange={props.handleInputChange}>
                        {countryOptions}
                    </Select>
                </FormControl>
                <FormControl className={classes.formDatepickers}>
                    <DatePicker
                        label="Start Date"
                        className={classes.datepickerEl}
                        inputVariant="outlined"
                        maxDate={dateUtils.endOfDay(new Date())}
                        value={props.startDate}
                        onChange={props.setStartDate} />
                    <DatePicker
                        label="End Date"
                        className={classes.datepickerEl}
                        inputVariant="outlined"
                        maxDate={dateUtils.endOfDay(new Date())}
                        value={props.endDate}
                        onChange={props.setEndDate} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Button type="submit" variant="contained" color="primary" disabled={!props.enableSubmit}>Submit</Button>
                </FormControl>
            </form>
        </MuiPickersUtilsProvider>
    );
}