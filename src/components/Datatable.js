import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';

import { getRowsPerPage, stableSort, getComparator } from './utils/TableUtils';
import DatatableHeader from './table/DatatableHeader';

const useStyles = makeStyles(() => ({
    root: {
        width: '90%',
        margin: '0 auto'
    },
    table: { minWidth: 750 },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    }
}));

export default function Datatable(props) {
    const { headerNames, data, orderByHeader } = props,
        classes = useStyles(),
        [order, setOrder] = useState('desc'),
        [orderBy, setOrderBy] = useState(orderByHeader),
        [page, setPage] = useState(0),
        [rowsPerPage, setRowsPerPage] = useState(getRowsPerPage(data.length));

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    useEffect(() => {
        setOrder('desc');
        setOrderBy(orderByHeader);
        setRowsPerPage(getRowsPerPage(data.length))
    }, [data, orderByHeader]);

    return (
        <div className={classes.root}>
            <TableContainer>
                <Table className={classes.table}>
                    <DatatableHeader
                        classes={classes}
                        headerNames={headerNames}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort} />
                    <TableBody>
                        {stableSort(data, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow key={row.Slug || 'row-' + index}>
                                        {headerNames.map((header, i) => {
                                            const label = row[header];
                                            return i === 0 ? <TableCell component="th" key={'cell-i-' + index} id={index} scope="row" align="right" padding="none">{label}</TableCell>
                                                           : <TableCell align="right" key={header + '-' + index}>{label}</TableCell>
                                        })}
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 33 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage} />
        </div>
    );
}