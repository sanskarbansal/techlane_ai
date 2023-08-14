const express = require("express");
const { exec } = require("child_process");
const util = require("util");
const { readPredictionResultsFromFile, savePredictionResultsToFile } = require("./utils/dataUtils");

const { calculateAccuracy, calculateF1Score, calculatePrecision, calculateRecall } = require("./utils/ml");
const app = express();
const PORT = 3000;

const execAsync = util.promisify(exec);

// Middleware
app.use(express.json());

app.get("/api/metrics", async (req, res) => {
    try {
        // Read prediction results from the file
        const predictionResults = await readPredictionResultsFromFile();

        // Calculate metrics based on prediction results
        const accuracy = calculateAccuracy(predictionResults);
        const precision = calculatePrecision(predictionResults);
        const recall = calculateRecall(predictionResults);
        const f1Score = calculateF1Score(precision, recall);

        if (accuracy !== null && precision !== null && recall !== null && f1Score !== null) {
            res.json({ accuracy, precision, recall, f1_score: f1Score });
        } else {
            res.status(404).json({ error: "No prediction results found or unable to calculate metrics" });
        }
    } catch (error) {
        console.error(`Error handling /api/metrics endpoint: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});

const runPythonScript = async (yearsOfExperience) => {
    const pythonScriptPath = "./aimodel/linear_reg.py";
    const pythonCommand = `python3 ${pythonScriptPath} ${yearsOfExperience}`;

    try {
        const { stdout, stderr } = await execAsync(pythonCommand);
        if (stderr) {
            throw new Error(`Error executing Python script: ${stderr}`);
        }
        return parseFloat(stdout);
    } catch (error) {
        throw new Error(`Error running Python script: ${error}`);
    }
};
app.post("/api/predict_salary", async (req, res) => {
    const yearsOfExperience = req.body.yearsOfExperience;
    console.log(req.body);
    const actual = req.body.actual;
    try {
        // Get the predicted salary from the Python script
        const predictedSalary = await runPythonScript(yearsOfExperience);

        await savePredictionResultsToFile(yearsOfExperience, actual, predictedSalary);

        res.json({ predicted_salary: predictedSalary });
    } catch (error) {
        console.error(`Error handling prediction: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
