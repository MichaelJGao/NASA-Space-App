document.addEventListener("DOMContentLoaded", function () {
    const calculateButton = document.getElementById("calculate");
    const resultElement = document.getElementById("result");

    calculateButton.addEventListener("click", function () {
        const distance = parseFloat(document.getElementById("distance").value);
        const fuelEfficiency = parseFloat(document.getElementById("fuel-efficiency").value);
        const fuelPrice = parseFloat(document.getElementById("fuel-price").value);

        if (!isNaN(distance) && !isNaN(fuelEfficiency) && !isNaN(fuelPrice)) {
            const co2Emissions = (distance / fuelEfficiency) * (2.3); // Assuming 2.3 kg CO2 per liter of gasoline

            resultElement.textContent = `Estimated CO2 Emissions: ${co2Emissions.toFixed(2)} kg`;
        } else {
            resultElement.textContent = "Please enter valid values for all fields.";
        }
    });
});
