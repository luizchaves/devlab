import * as d3 from 'd3';
import * as echarts from 'echarts';
import './style.css';

const metrics = [
  { month: 'Jan', latency: 180, traffic: 38 },
  { month: 'Fev', latency: 142, traffic: 45 },
  { month: 'Mar', latency: 165, traffic: 52 },
  { month: 'Abr', latency: 120, traffic: 61 },
  { month: 'Mai', latency: 132, traffic: 68 },
  { month: 'Jun', latency: 110, traffic: 74 },
];

function renderD3Chart(data) {
  const width = 420;
  const height = 280;
  const margin = { top: 24, right: 24, bottom: 42, left: 48 };

  const svg = d3
    .select('#d3-chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img');

  const x = d3
    .scaleBand()
    .domain(data.map((item) => item.month))
    .range([margin.left, width - margin.right])
    .padding(0.18);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (item) => item.traffic)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

  svg
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (item) => x(item.month))
    .attr('y', (item) => y(item.traffic))
    .attr('width', x.bandwidth())
    .attr('height', (item) => y(0) - y(item.traffic))
    .attr('rx', 6)
    .attr('fill', '#2563eb');
}

function renderECharts(data) {
  const chart = echarts.init(document.querySelector('#echarts-chart'));

  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { top: 32, right: 24, bottom: 56, left: 48 },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.month),
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Latência',
        type: 'line',
        smooth: true,
        data: data.map((item) => item.latency),
      },
      {
        name: 'Tráfego',
        type: 'bar',
        data: data.map((item) => item.traffic),
      },
    ],
  });

  window.addEventListener('resize', () => chart.resize());
}

renderD3Chart(metrics);
renderECharts(metrics);
