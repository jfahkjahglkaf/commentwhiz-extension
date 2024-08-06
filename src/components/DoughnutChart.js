import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    LegendComponent,
    TitleComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { LabelLayout } from 'echarts/features';

echarts.use([
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

const DoughnutChartComponent = ({ data, chartId, chartOptions }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const myChart = echarts.init(chartRef.current);

        // Calculate the total sum of the values
        const total = data.reduce((sum, item) => sum + item.value, 0);

        // Find the largest value
        const positiveValue = data.find((item) => item.name === 'Positive')?.value;
        
        // Calculate the percentage of the largest value
        const percentage = ((positiveValue / total) * 100).toFixed(2);

        const defaultOptions = {
            title: {
                text: `${percentage}% \nPositive`,
                left: 'center',
                top: 'center',
                textStyle: {
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            series: [
                {
                    type: 'pie',
                    radius: ['60%', '70%'],
                    data: data,
                    color: ['#545454', '#81FF03']
                    //color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'] // Custom colors
                }
            ]
        };

        const options = { ...defaultOptions, ...chartOptions };
        myChart.setOption(options);

        return () => {
            myChart.dispose();
        };
    }, [data, chartOptions]);

    return <div id={chartId} ref={chartRef} style={{ width: '100%', height: '100px' }} />;
};

export default DoughnutChartComponent;
