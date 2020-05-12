import * as d3 from 'd3';

export default class D3RadialBarChart {
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

        // Set the dimensions
        const columns = Object.keys(covidData[0]),
            width = 975,
            height = width,
            innerRadius = 160,
            outerRadius = Math.min(width, height) / 2,
            arc = d3.arc()
                    .innerRadius(d => y(d[0]))
                    .outerRadius(d => y(d[1]))
                    .startAngle(d => x(d.data.code))
                    .endAngle(d => x(d.data.code) + x.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius),
            x = d3.scaleBand()
                    .domain(covidData.map(d => d.code))
                    .range([0, 2 * Math.PI])
                    .align(0),
            y = this._getY(innerRadius, outerRadius),
            z = d3.scaleOrdinal()
                    .domain(columns.slice(1))
                    .range(['#E76F51', '#F4A261','#E9C46A', '#2A9D8F', '#264653', '#ffe5d9']);

        const xAxis = g => g
             .attr('text-anchor', 'middle')
             .call(g => g.selectAll('g')
                         .data(covidData)
                         .join('g')
                         .attr('transform', d => `rotate(${((x(d.code) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
                                                  translate(${innerRadius},0)`)
                         .call(g => g.append('line')
                                     .attr('x2', -5)
                                     .attr('stroke', '#000'))
                         .call(g => g.append('text')
                                     .attr('transform', d => (x(d.code) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                                                                ? 'rotate(90)translate(0,16)'
                                                                : 'rotate(-90)translate(0,-9)')
                                     .text(d => d.code)));

        const yAxis = g => g
             .attr('text-anchor', 'middle')
             .call(g => g.append('text')
                         .attr('y', d => -y(y.ticks(5).pop()))
                         .attr('dy', '-1em')
                         .text('COVID-19 Cases'))
             .call(g => g.selectAll('g')
                         .data(y.ticks(5).slice(1))
                         .join('g')
                         .attr('fill', 'none')
                         .call(g => g.append('circle')
                                     .attr('stroke', '#666')
                                     .attr('stroke-opacity', 0.5)
                                     .attr('r', y))
                         .call(g => g.append('text')
                                     .attr('y', d => -y(d))
                                     .attr('dy', '0.35em')
                                     .attr('stroke', '#fff')
                                     .attr('stroke-width',  5)
                                     .text(y.tickFormat(5, 's'))
                         .clone(true)
                         .attr('fill', '#000')
                         .attr('stroke', 'none')));

        const legend = g => g.append('g')
                   .selectAll('g')
                   .data(columns.slice(1).reverse())
                   .join('g')
                     .attr('transform', (d, i) => `translate(-40,${(i - (columns.length - 1) / 2) * 20})`)
                     .call(g => g.append('rect')
                         .attr('width', 18)
                         .attr('height', 18)
                         .attr('fill', z))
                     .call(g => g.append('text')
                         .attr('x', 24)
                         .attr('y', 9)
                         .attr('dy', '0.35em')
                         .text(d => d));

        this.svg = d3.select(containerEl)
                     .append('svg')
                     .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
                     .style('width', '100%')
                     .style('height', 'auto')
                     .style('font', '10px sans-serif');

        this.svg.append('g')
                .selectAll('g')
                .data(d3.stack().keys(columns.slice(1))(covidData))
                .join('g')
                .attr('fill', d => z(d.key))
                .selectAll('path')
                .data(d => d)
                .join('path')
                .attr('d', arc);

        this.svg.append('g').call(xAxis);
        this.svg.append('g').call(yAxis);
        this.svg.append('g').call(legend);
    }

    _getY(innerR, outerR) {
        const y = d3.scaleLinear()
          .domain([0, d3.max(this.props.covidData, d => d.Total)])
          .range([innerR * innerR, outerR * outerR]);

        return Object.assign(d => Math.sqrt(y(d)), y);
    }
}