document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeButton');
    const contractText = document.getElementById('contractText');
    const fileInput = document.getElementById('fileInput');
    const riskScore = document.getElementById('riskScore');
    const concernsList = document.getElementById('concernsList');
    const processedText = document.getElementById('processedText');

    analyzeButton.addEventListener('click', async () => {
        let textToAnalyze = contractText.value;

        // In a real app, handle file reading here and send text
        if (fileInput.files.length > 0) {
            alert("File reading not implemented yet. Please paste text directly for now.");
            return;
        }

        if (!textToAnalyze.trim()) {
            alert("Please paste text or select a file to analyze.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textToAnalyze }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result); // Log the result for now

            // Update results display (placeholder for now)
            riskScore.textContent = "Overall Risk Score: Placeholder";
            concernsList.innerHTML = "<p>Analysis complete (details to follow).</p>";
            processedText.textContent = textToAnalyze; // Display original text for now

        } catch (error) {
            console.error('Error during analysis:', error);
            alert('Analysis failed. Check console for details.');
        }
    });
});