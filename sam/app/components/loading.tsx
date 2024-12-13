import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingScreen: React.FC = () => {
    return (
        <div className='flex w-screen h-screen items-center justify-center bg-[#FDFFE8]'>
             <CircularProgress
                size={60}
                thickness={5}
                sx={{
                    color: 'orange',
                    borderRadius: '50%',
                }}
            />
        </div>
    );
};

export default LoadingScreen;