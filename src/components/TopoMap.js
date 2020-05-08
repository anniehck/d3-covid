import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import D3TopoMap from './graphs/D3TopoMap';
import startCase from 'lodash/startCase';

let vis = null;

/**
 * @param {Object} props
 *  @param {Object} props.data
 *  @param {String} props.mapType
 *  @param {String} [props.country]
 */
export default function TopoMap({ data, mapType, country }) {
    const [worldTopo, setWorldTopo] = useState(null),
        refElement = useRef(null);

    useEffect(() => {
        d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(res => {
                if (mapType === 'world') {
                    setWorldTopo(res);
                } else if (mapType === 'country' && country) {
                    const countryTopo = res.features.filter((feature) => feature.properties.name === startCase(country));
                    setWorldTopo(countryTopo);
                }
            })
            .catch(err => console.log('Error getting topo feature data'));
    }, [country, mapType]);

    useEffect(() => {
        if (worldTopo && data) {
            vis = new D3TopoMap(refElement.current, mapType, {
                topoData: worldTopo, covidSummary: data
            });
        }
    }, [worldTopo, data, mapType]);

    return (
        <div ref={refElement} />
    );
};