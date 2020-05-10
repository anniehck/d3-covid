import React, { useEffect, useRef } from 'react';
import D3BubblePlot from './graphs/D3BubblePlot';
import D3RadialBarChart from './graphs/D3RadialBarChart';

let vis = null;

const ChartContainer = (props) => {
    const refElement = useRef(null),
        { data, chartType } = props;

    useEffect(() => {
        if (data) {
            vis = chartType === 'bubble'
                    ? new D3BubblePlot(refElement.current, { covidData: data })
                    : new D3RadialBarChart(refElement.current, { covidData: data });
        }
    }, [data, chartType]);

    return (
        <div ref={refElement} />
    )
};

export default ChartContainer;