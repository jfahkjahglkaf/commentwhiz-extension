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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

echarts.use([
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

export function Rating({ data, rating, chartOptions, chartId }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (rating !== null && rating !== 0) {
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
                        color: ['#545454', '#d12e2e','#81FF03']
                    }
                ]
            };

            const options = { ...defaultOptions, ...chartOptions };
            myChart.setOption(options);

            return () => {
                myChart.dispose();
            };
        }
    }, [rating, data, chartOptions]); // Dependencies now include `rating`
    
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column', // Change to column to stack elements vertically
        alignItems: 'center',
    };

    const getColorBasedOnRating = (rating) => {
        if (rating === 0) {
            return '#000000'; // Black for ratings that are 0
        } else if (rating < 50) {
            return '#000000'; // Red for ratings below 50
        } else if (rating >= 50 && rating <= 75) {
            return '#000000'; // Yellow for ratings between 50 and 75
        } else {
            return '#000000'; // Green for ratings above 75
        }
    };
    
    const textStyle = {
        alignSelf: 'flex-start', // Align text to the left
        fontSize: '1em', // Change font size to half
        color: getColorBasedOnRating(rating), // Change text color
        fontFamily: 'Caveat, sans-serif', // Change font family
    };

    return (
        <div style={containerStyle}>
            {rating !== null && (
                <p style={textStyle}>
                    {rating === 0 ? (
                        <>
                            Use the button to scan comments!
                            <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '6px' }} />
                        </>
                    ) : (
                        "Overall Comment Sentiment"
                    )}
                </p>
            )}
            <div id={chartId} ref={chartRef} style={{ width: '100%', height: '100px' }}></div>
        </div>
    );
}

export default Rating;
