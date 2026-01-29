import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
    carouselSpeed: number; // in milliseconds
    setCarouselSpeed: (speed: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to 10 seconds (10000ms)
    const [carouselSpeed, setCarouselSpeedState] = useState<number>(() => {
        const saved = localStorage.getItem("site_settings_carousel_speed");
        return saved ? parseInt(saved, 10) : 10000;
    });

    const setCarouselSpeed = (speed: number) => {
        setCarouselSpeedState(speed);
        localStorage.setItem("site_settings_carousel_speed", speed.toString());
    };

    return (
        <SettingsContext.Provider value={{ carouselSpeed, setCarouselSpeed }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
