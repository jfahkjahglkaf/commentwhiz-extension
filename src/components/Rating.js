import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

function Rating({ rating }) {
    // Decide to show pie chart or numeric rating based on the presence of rating
    if (rating !== null) {
        const pieChartData = [
            { title: 'Rating', value: rating, color: '#E38627' },
            { title: 'Remaining', value: 5 - rating, color: '#C13C37' },
        ];

        return (
            <div>
                {/* Display Pie Chart */}
                <PieChart data={pieChartData} />
                {/* Display Numeric Rating */}
                <p>Rating: {rating} / 5</p>
            </div>
        );
    }

    return <p>No rating available</p>;
};

export default Rating;