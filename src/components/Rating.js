import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

export function Rating({ rating }) {
    // Decide to show pie chart or numeric rating based on the presence of rating
    if (rating !== null) {
        const pieChartData = [
            { title: 'Rating', value: rating, color: '#4CAF50' },
            { title: 'Remaining', value: 5 - rating, color: '#C13C37' },
        ];

        const containerStyle = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
        };

        const pieChartStyle = {
            width: '50px', // Adjust width as needed
            height: '50px', // Adjust height as needed
        };

        const ratingTextStyle = {
            marginTop: '10px',
            fontSize: '16px',
            color: '#333',
        };

        return (
            <div style={containerStyle}>
                {/* Display Pie Chart */}
                <PieChart data={pieChartData} style={pieChartStyle} />
                {/* Display Numeric Rating */}
                <p style={ratingTextStyle}>Rating: {rating} / 5</p>
            </div>
        );
    }

    return <p>No rating available</p>;
};

export default Rating;
