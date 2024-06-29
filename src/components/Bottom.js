import React from 'react';
import { FaHome, FaInfoCircle, FaCog } from 'react-icons/fa';
import { Button as FlowbiteButton } from "flowbite-react";
import { HiExternalLink } from "react-icons/hi";

export function Bottom() {
    return (
        <div className="w-full mt-auto">
            <div className="flex justify-end items-center space-x-2">
                <a href="https://localhost:3000/report" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                    <FlowbiteButton className='text-black'>
                        Open Report
                        <HiExternalLink className='ml-2 h-5 w-5 text-black' />
                    </FlowbiteButton>
                </a>
                <div className="flex space-x-4">
                    <a href="/home" className="text-black"><FaHome size="3em" className="text-gray-700" /></a>
                    <a href="/info" className="text-black"><FaInfoCircle size="3em" className="text-gray-700" /></a>
                    <a href="/settings" className="text-black"><FaCog size="3em" className="text-gray-700" /></a>
                </div>
            </div>
        </div>
    );
}
