import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import startCase from 'lodash/startCase';

export default function DatatableHeader(props) {
    const { classes, headerNames, order, orderBy, onRequestSort } = props,
        headers = headerNames.map((h) => {
            const numeric = /(confirmed|deaths|recovered|active|date|rate)/i.test(h);
            return {
                id: h,
                numeric,
                disablePadding: !numeric,
                label: startCase(h)
            };
        });

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headers.map((header) => (
                    <TableCell
                        key={header.id}
                        align={header.numeric ? 'right' : 'left'}
                        padding={header.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === header.id ? order : false}>
                            <TableSortLabel
                                active={orderBy === header.id}
                                direction={orderBy === header.id ? order : 'asc'}
                                onClick={createSortHandler(header.id)}>
                                {header.label}
                                {orderBy === header.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}