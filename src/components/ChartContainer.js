import React, { useEffect, useRef } from 'react';
import D3BubblePlot from './graphs/D3BubblePlot';

let vis = null;

const ChartContainer = (props) => {
    const refElement = useRef(null),
        data = props.data;

    useEffect(() => {
        if (data) {
            vis = new D3BubblePlot(refElement.current, {
                covidData: data
            });
        }
    }, [data]);

    return (
        <div ref={refElement} />
    )
};

export default ChartContainer;