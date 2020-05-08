import * as d3 from 'd3';
import maxBy from 'lodash/maxBy';
import inRange from 'lodash/inRange';

export default class D3BubblePlot {
    containerEl;
    props;
    svg;

    constructor(containerEl, props) {
        this.containerEl = containerEl;
        this.props = props;
        this.svg = this.init();
    }

    init() {
        const containerEl = this.containerEl,
            covidData = this.props.covidData;

        if (!covidData.length) {
            return;
        }

        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 20, bottom: 30, left: 50 },
            width = 800 - margin.left - margin.right,
            height = 604 - margin.top - margin.bottom,
            covidDataWithColors = this._addColorMapping(covidData),
            maxConfirmed = maxBy(covidData, d => d.TotalConfirmed).TotalConfirmed,
            maxDeaths = maxBy(covidData, d => d.TotalDeaths).TotalDeaths,
            maxRecovered = maxBy(covidData, d => d.TotalRecovered).TotalRecovered,
            colors = d3.scaleOrdinal()
                        .domain('ABCDEFGHIJ'.split(''))
                        .range(d3.schemeSet2);

        this.svg = d3.select(containerEl)
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Add x, y axis, z (scale for bubble size)
        const x = d3.scaleLinear()
                    .domain([0, maxRecovered * 1.15])
                    .range([0, width]),
            y = d3.scaleLinear()
                    .domain([0, maxDeaths * 1.2])
                    .range([height, 0]),
            z = d3.scaleLinear()
                    .domain([0, maxConfirmed])
                    .range([1, 100]);

        this.svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x));
        this.svg.append('g')
                .call(d3.axisLeft(y));


        const tooltip = this._createTooltip(),
            self = this;

        // Define functions to show/hide tooltips
        const showTooltip = function(d) {
            tooltip.transition().duration(200);
            tooltip.style('opacity', 1)
                    .html(self._getTooltipData(d))
                    .style('right', '60px')
                    .style('bottom', '-100px');
        },
            hideTooltip = function(d) {
                tooltip.transition()
                       .duration(200)
                       .style('opacity', 0);
            }

        // Add dots
        this.svg.append('g')
                .selectAll('dot')
                .data(covidDataWithColors)
                .enter()
                .append('circle')
                .attr('class', 'bubbles')
                .attr('cx', d => x(d.TotalRecovered))
                .attr('cy', d => y(d.TotalDeaths))
                .attr('r', d => z(d.TotalConfirmed))
                .style('fill', d => colors(d.colorRange))
                .on('mouseover', showTooltip)
                .on('mouseleave', hideTooltip);
    }

    /**
     * Create tooltip element
     */
    _createTooltip() {
        const tooltip = d3.select(this.containerEl)
                            .append('div')
                            .style('opacity', 0)
                            .attr('class', 'tooltip')
                            .style('position', 'absolute')
                            .style('background-color', '#2c3342')
                            .style('border-radius', '5px')
                            .style('padding', '10px')
                            .style('color', 'white');
        return tooltip;
    }

    /**
     * Add color mapping based on totalConfirmed range
     *
     * @param {Object[]} covidData
     * @returns {Object[]}
     */
    _addColorMapping(covidData) {
        covidData.forEach((d) => {
            const totalConf = d.TotalConfirmed;
            if (inRange(totalConf, 0, 999)) {
                d.colorRange = 'A';
            } else if (inRange(totalConf, 1000, 2999)) {
                d.colorRange = 'B';
            } else if (inRange(totalConf, 3000, 4999)) {
                d.colorRange = 'C';
            } else if (inRange(totalConf, 5000, 9999)) {
                d.colorRange = 'D';
            } else if (inRange(totalConf, 10000, 19999)) {
                d.colorRange = 'E';
            } else if (inRange(totalConf, 20000, 49999)) {
                d.colorRange = 'F';
            } else if (inRange(totalConf, 50000, 99999)) {
                d.colorRange = 'G';
            } else if (inRange(totalConf, 100000, 149999)) {
                d.colorRange = 'H';
            } else if (inRange(totalConf, 150000, 199999)) {
                d.colorRange = 'I';
            } else {
                // range 200000+
                d.colorRange = 'J';
            }
        });

        return covidData;
    }

    /**
     * Parse country stats into HTML string
     *
     * @param {Object} d
     * @returns {String} html string containing country stats
     */
    _getTooltipData(d) {
        const arr = [
            d.Country,
            `<ul><li>New Confirmed: ${d.NewConfirmed.toLocaleString()}</li>`,
            `<li>New Deaths: ${d.NewDeaths.toLocaleString()}</li>`,
            `<li>New Recovered: ${d.NewRecovered.toLocaleString()}</li>`,
            `<li>Total Confirmed: ${d.TotalConfirmed.toLocaleString()}</li>`,
            `<li>Total Deaths: ${d.TotalDeaths.toLocaleString()}</li>`,
            `<li>Total Recovered: ${d.TotalRecovered.toLocaleString()}</li></ul>`
        ];

        return arr.join('');
    }
}