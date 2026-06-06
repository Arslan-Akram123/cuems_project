// src/components/TopProgressBar.jsx
import { useState, useEffect } from 'react';

const TopProgressBar = ({ isActive }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isActive) {
            // Reset progress to 0 when it becomes active
            setProgress(0);
            
            // This simulates the loading progress. In a real app with large
            // assets, this would be tied to actual load events.
            // For an SPA, a simulated fast-to-slow progression is common.
            const timers = [
                setTimeout(() => setProgress(30), 100),  // Start fast
                setTimeout(() => setProgress(70), 500),  // Slow down
                setTimeout(() => setProgress(95), 1500)  // Almost there
            ];

            return () => timers.forEach(clearTimeout);
        } else {
            // When isActive becomes false, complete the bar and fade it out
            setProgress(100);
            const fadeOutTimer = setTimeout(() => {
                setProgress(0); // Reset for the next use
            }, 500); // 0.5s after completion, it disappears

            return () => clearTimeout(fadeOutTimer);
        }
    }, [isActive]);

    // Don't render the bar if progress is 0
    if (progress === 0) return null;

    return (
        <div className=" w-full h-1 fixed top-0 left-0 z-50">
            <div
                className="h-full bg-teal-500 shadow-lg shadow-teal-500/50"
                style={{
                    width: `${progress}%`,
                    transition: 'width 0.3s ease-out', // Smooth transition for width changes
                    opacity: progress === 100 ? 0 : 1, // Fade out on completion
                    transitionProperty: 'width, opacity',
                    transitionDuration: '0.3s, 0.5s'
                }}
            ></div>
        </div>
    );
};

export default TopProgressBar;