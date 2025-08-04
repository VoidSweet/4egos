interface IThemeColors {
    band?: string;
    mode?: 'dark' | 'light';
}

interface IBaseColors {
    background: string;
    ui: string;
    flow: string;
    text: string;
    overlay: string;
    icon: string | null;
} 

const blackColor = '#000000';
const whiteColor = '#ffffff';

const basesColors = {
    dark: {
        background: '#0a0f1c', // Dark blue background
        ui: whiteColor,
        flow: blackColor,
        text: whiteColor,
        overlay: blackColor,
        icon: whiteColor
    },
    light: {
        background: '#f0f8ff', // Light blue background
        ui: blackColor,
        flow: whiteColor,
        text: blackColor,
        overlay: whiteColor,
        icon: null
    },
};

const tonalits = Object.entries({
    "5": '0d', 
    "10": '1a', 
    "15": '26', 
    "20": '33', 
    "40": '66', 
    "60": '99', 
    "80": 'cc', 
    "100": ''
});

function ThemeVariables({ band = "#1e40af", mode = 'dark' }: IThemeColors = {}) { // Changed to blue theme
    const baseColors: IBaseColors = basesColors[mode] || basesColors['dark'];
    
    const obj = {
        "--luny-colors-background": baseColors.background,
        ...mapTonalits("--luny-colors-band", band),
        ...mapTonalits("--luny-colors-ui", baseColors.ui),
        ...mapTonalits("--luny-colors-flow", baseColors.flow),
        ...mapTonalits("--luny-colors-text", baseColors.text),
        "--luny-colors-overlay": baseColors.overlay + "E6",
        "--luny-colors-icon": baseColors.icon || band,
        ...mapTonalits("--luny-colors-light", whiteColor),
        ...mapTonalits("--luny-colors-dark", blackColor),
        "--luny-colors-green": "#10b981", // Modern green
        "--luny-colors-red": "#ef4444"   // Modern red
    };

    return { 
        ...obj,
        toString: () => {
            return Object.entries({ ...obj }).map(([key, value]) => `${key}:${value};`).join("")
        }
    };
};

function mapTonalits(key: string, color: string) {
    return  Object.fromEntries(
        tonalits.map(([tonalit, value]) => [`${key}-${tonalit}`, `${color}${value}`])
    );
};
    
export default ThemeVariables;
module.exports.mapTonalits = mapTonalits;