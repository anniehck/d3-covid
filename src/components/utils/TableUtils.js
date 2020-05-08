export function getRowsPerPage(dataLength) {
    if (dataLength < 10) {
        return 5;
    } else if (dataLength < 25) {
        return 10;
    } else {
        return 25;
    }
}

export function stableSort(arr, comparator) {
    const stabilizedThis = arr.map((el, i) => [el, i]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    return stabilizedThis.map(el => el[0]);
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}