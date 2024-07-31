import React from 'react';
import { FaHome, FaInfoCircle, FaCog } from 'react-icons/fa';
import { Button as FlowbiteButton } from "flowbite-react";
import { HiExternalLink } from "react-icons/hi";

export function Bottom({ tabURL, overallRatings }) {
    return (
        <div className="w-full">
            <div className="flex justify-end items-center space-x-2">
                {overallRatings ? (
                    <a href={`https://localhost:3000/report/${encodeURIComponent(tabURL)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                        <FlowbiteButton className='text-black'>
                            Open Report
                            <HiExternalLink className='ml-2 h-5 w-5 text-black' />
                        </FlowbiteButton>
                    </a>
                ) : (
                    <div className="h-3 w-3"></div>
                )}
                <div className="flex space-x-4">
                    <a href="/home" className="text-black"><FaHome size="2em" className="text-gray-700" /></a>
                    <a href="/info" className="text-black"><FaInfoCircle size="2em" className="text-gray-700" /></a>
                    <a href="/settings" className="text-black"><FaCog size="2em" className="text-gray-700" /></a>
                </div>
            </div>
        </div>
    );
}