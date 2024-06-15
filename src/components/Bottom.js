import React from 'react';
import { FaHome, FaInfoCircle, FaCog } from 'react-icons/fa'; // Import the additional icon
import { Button as FlowbiteButton } from "flowbite-react";
import { HiExternalLink } from "react-icons/hi";
export function Bottom() {
    return (
        <div className="fixed bottom-0 p-4">
            <div className="flex justify-between w-full">
                <a href="http://localhost:3000/report/1" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <FlowbiteButton>
                        Open Report
                        <HiExternalLink className='mr-2 h-5 w-5' />
                    </FlowbiteButton>
                </a>
                <div className="flex space-x-4">
                    <a href="/home"><FaHome size="3em" /></a>
                    <a href="/info"><FaInfoCircle size="3em" /></a>
                    <a href="/settings"><FaCog size="3em" /></a>
                </div>
            </div>
        </div>
    );
}