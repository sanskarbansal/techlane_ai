// Create a utility file named dataUtils.js
const fs = require("fs").promises;
const path = require("path");
const util = require("util");

// const writeFileAsync = util.promisify(fs.writeFile);
const outputFilePath = "prediction_results.json";

const readPredictionResultsFromFile = async () => {
    try {
        const data = await fs.readFile(outputFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading prediction results from file: ${error}`);
        throw new Error("Unable to retrieve prediction results");
    }
};

const savePredictionResultsToFile = async (input, actual, predicted) => {
    try {
        const data = { input, actual, predicted };
        // Read the existing JSON data from the file
        let existingData = [];
        try {
            existingData = await readPredictionResultsFromFile();
        } catch (readError) {
            // Ignore read error if the file doesn't exist or is empty
        }

        existingData.push(data);
        const jsonResults = JSON.stringify(existingData, null, 2);

        await fs.writeFile(outputFilePath, jsonResults, "utf-8");

        console.log("Result appended to file successfully.");
    } catch (error) {
        throw new Error(`Error saving prediction results to file: ${error}`);
    }
};

module.exports = {
    readPredictionResultsFromFile,
    savePredictionResultsToFile,
};
