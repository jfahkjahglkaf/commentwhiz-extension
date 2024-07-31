import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

export function Rating({ rating }) {
    if (rating !== null) {
        const pieChartData = [
            { name: 'Rating', value: rating },
            { name: 'Remaining', value: 5 - rating },
        ];

        const COLORS = ['#4CAF50', '#C13C37'];

        const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        };

        const pieChartStyle = {
            width: '100px', // Adjust width as needed
            height: '100px', // Adjust height as needed
        };

        const ratingTextStyle = {
            marginLeft: '10px',
            fontSize: '16px',
            color: '#333',
        };

        const renderCustomTooltip = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow">
                        <p className="label text-sm">{`${data.value.toFixed(1)}`}</p>
                    </div>
                );
            }

            return null;
        };

        return (
            <div style={containerStyle}>
                {/* Display Pie Chart */}
                <PieChart width={100} height={100} style={pieChartStyle}>
                    <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltip} />
                </PieChart>
                {/* Display Numeric Rating */}
                <p style={ratingTextStyle}>Rating: {rating} / 5</p>
            </div>
        );
    }

    return <p>No rating available</p>;
};

export default Rating;
