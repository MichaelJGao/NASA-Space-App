// Elements for simulation controls
const lightSlider = document.getElementById("light");
const co2Slider = document.getElementById("co2");
const nutrientsSlider = document.getElementById("nutrients");
const temperatureSlider = document.getElementById("temperature");
const phSlider = document.getElementById("ph");
const growthRateElement = document.getElementById("growth-rate");

// Growth rate based on input values
function calculateGrowthRate() {
    const light = parseInt(lightSlider.value);
    const co2 = parseInt(co2Slider.value);
    const nutrients = parseInt(nutrientsSlider.value);
    const temperature = parseInt(temperatureSlider.value);
    const ph = parseInt(phSlider.value);

    // Growth rate calculation
    let growthRate = (light + co2 + nutrients - temperature - ph) / 10; // Adjust the divisor for scaling

    // Growth rate is within the range [0, 100]
    growthRate = Math.min(Math.max(growthRate, 0), 100);
    if (light === 0 || co2 === 0 || temperature === 0 || temperature === 100) {
        growthRate = 0;
    }

    growthRateElement.textContent = `Growth Rate per Day: ${growthRate.toFixed(2)}%`;
}

// Add event listeners to the sliders for real-time updates
lightSlider.addEventListener("input", calculateGrowthRate);
co2Slider.addEventListener("input", calculateGrowthRate);
nutrientsSlider.addEventListener("input", calculateGrowthRate);
temperatureSlider.addEventListener("input", calculateGrowthRate);
phSlider.addEventListener("input", calculateGrowthRate);

// Calculation
calculateGrowthRate();
