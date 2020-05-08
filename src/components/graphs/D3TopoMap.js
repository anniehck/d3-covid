import * as d3 from 'd3';
import * as d3Geo from 'd3-geo-projection';
import * as topojson from 'topojson-client';
import _ from 'lodash';
import { TOPOLOGY_DATA } from '../../data/world-50m.js';
import { COUNTRY_DATA } from '../../data/country-data.js';

const countryData = COUNTRY_DATA.map((country) => {
    return {
        lat: country.latlng[0],
        long: country.latlng[1],
        name: country.name,
        code: country.country_code
    };
});

export default class D3TopoMap {
    containerEl;
    props;
    svg;

    constructor(containerEl, type, props) {
        this.containerEl = containerEl;
        this.props = props;
        this.svg = type === 'world' ? this.initWorld() : this.initCountry();
    }

    initCountry() {
        const width = 460,
            height = 400,
            countryFeature = this.props.topoData,
            covidData = this.props.covidSummary,
            projection = d3.geoMercator()
                            .center([4, 47])
                            .scale(120)
                            .translate([width / 2, height / 2]);

        this.svg = d3.select(this.containerEl)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr("viewBox", [0, 0, width / 2, height / 2]);


        // Draw the map
        this.svg.append('g')
            .selectAll('path')
            .data(countryFeature)
            .enter()
            .append('path')
              .attr('fill', '#b8b8b8')
              .attr('d', d3.geoPath().projection(projection))
            .style('stroke', '#777')
            .style('opacity', .3);
    }

    initWorld() {
        const worldFeature = this.props.topoData,
            covidData = this.props.covidSummary,
            projection = d3Geo.geoMollweide(),
            path = d3.geoPath(projection),
            sphere = ({ type: 'Sphere' }),
            graticule = d3.geoGraticule10(),
            neighbors = topojson.neighbors(TOPOLOGY_DATA.objects.countries.geometries),
            countries = topojson.feature(TOPOLOGY_DATA, TOPOLOGY_DATA.objects.countries).features,
            index = this.getIndex(countries, neighbors),
            height = this.getHeight(projection, sphere, 975);

        this.svg = d3.select(this.containerEl)
                    .append('svg')
                    .attr("viewBox", [0, 0, 975, height]);

        // Add world map
        this.svg.append('path')
            .attr('fill', 'none')
            .attr('stroke', '#ccc')
            .attr('stroke-linejoin', 'round')
            .attr('d', path(graticule));

        this.svg.append('g')
            .selectAll('path')
            .data(topojson.feature(TOPOLOGY_DATA, TOPOLOGY_DATA.objects.countries).features)
            .join('path')
            .attr('class', 'country')
            .attr('stroke', '#ccc')
            .attr('fill', (d, i) => d3.schemeCategory10[index[i] % 10])
            .attr('fill-opacity', .7)
            .attr('d', path);

        this.svg.append('path')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5)
            .attr('d', path(sphere));

        // Draw the map
        this.svg.append('g')
            .selectAll('path')
            .data(worldFeature)
            .enter()
            .append('path')
              .attr('fill', '#b8b8b8')
              .attr('d', d3.geoPath()
                  .projection(projection)
              )
            .style('stroke', 'black')
            .style('opacity', .3)

        // Create tooltip
        var Tooltip = d3.select(this.containerEl)
                          .append('div')
                          .attr('class', 'tooltip')
                          .style('position', 'absolute')
                          .style('opacity', 1)
                          .style('background-color', 'white')
                          .style('border', 'solid')
                          .style('border-width', '2px')
                          .style('border-radius', '5px')
                          .style('padding', '5px');

        // Change the tooltip when user hover / move / leave a cell
        const self = this;
        const mouseover = function(d) {
            Tooltip.style('opacity', 1);
        },
            mousemove = function(d) {
              Tooltip
                .html(self.getTooltipData(d))
                .style('right', '100px')
                .style('bottom', '100px');
            },
            mouseleave = function(d) {
              Tooltip.style("opacity", 0)
          };
          const circleData = _.filter(this.getCircleData(covidData), d => d !== null);

      // Add circles
      this.svg
        .selectAll('myCircles')
        .data(circleData)
        .enter()
        .append('circle')
          .attr('cx', function(d){ return projection([d.long, d.lat])[0] })
          .attr('cy', function(d){ return projection([d.long, d.lat])[1] })
          .attr('r', 14)
          .attr('class', 'circle')
          .style('fill', '69b3a2')
          .attr('stroke', '#69b3a2')
          .attr('stroke-width', 3)
          .attr('fill-opacity', .4)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave);
    }

    getTooltipData(d) {
        if (!d.totals) {
            return;
        }

        const arr = [
            d.name,
            `<ul><li>New Confirmed: ${d.new.confirmed}</li>`,
            `<li>New Deaths: ${d.new.deaths}</li>`,
            `<li>New Recovered: ${d.new.recovered}</li>`,
            `<li>Total Confirmed: ${d.totals.confirmed}</li>`,
            `<li>Total Deaths: ${d.totals.deaths}</li>`,
            `<li>Total Recovered: ${d.totals.recovered}</li></ul>`
        ];

        return arr.join('');
    }

    getCircleData(covidData) {
        return covidData.Countries.map((c) => {
            const countryMatch = _.find(countryData, function(d) {
                return d.code === c.CountryCode;
            });

            if (!countryMatch) {
                return null;
            }

            return {
                lat: countryMatch.lat,
                long: countryMatch.long,
                name: c.Country,
                totals: {
                    confirmed: c.TotalConfirmed,
                    deaths: c.TotalDeaths,
                    recovered: c.TotalRecovered
                },
                new: {
                    confirmed: c.NewConfirmed,
                    deaths: c.NewDeaths,
                    recovered: c.NewRecovered
                }
            };
        });
    }

    getIndex(countries, neighbors) {
        const index = new Int32Array(countries.length);
        for (let i = 0; i < index.length; i++) {
            index[i] = d3.max(neighbors[i], j => index[j]) + 1 | 0;
        }
        return index;
    }

    getHeight(projection, sphere, width) {
        const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, sphere)).bounds(sphere);
        const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
        return dy;
    }
}