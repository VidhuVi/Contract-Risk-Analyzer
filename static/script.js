document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeButton');
    const contractTextarea = document.getElementById('contractText');
    const fileInput = document.getElementById('fileInput');
    const riskScoreSpan = document.getElementById('riskScore');
    const concernsListDiv = document.getElementById('concernsList');
    const processedTextPre = document.getElementById('processedText');

    analyzeButton.addEventListener('click', async () => {
        let payload;
        let fetchOptions = {
            method: 'POST',
            headers: {}
        };

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            payload = new FormData();
            payload.append('file', file);
            fetchOptions.body = payload;

        } else if (contractTextarea.value.trim()) {
            payload = JSON.stringify({ text: contractTextarea.value.trim() });
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = payload;

        } else {
            alert("Please paste text or select a file to analyze.");
            return;
        }

        // Clear previous results
        riskScoreSpan.textContent = "Overall Risk Score: Analyzing...";
        concernsListDiv.innerHTML = "<p>Processing...</p>";
        processedTextPre.textContent = "Processing...";

        try {
            const response = await fetch('http://127.0.0.1:5000/analyze', fetchOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
            }

            const result = await response.json();
            console.log('Analysis Result:', result);

            riskScoreSpan.textContent = `Overall Risk Score: (Placeholder - based on ${result.num_tokens} tokens, ${result.num_sentences} sentences)`;
            concernsListDiv.innerHTML = `
                <p>Document processed by SpaCy.</p>
                <p>Number of sentences: ${result.num_sentences}</p>
                <p>Number of tokens: ${result.num_tokens}</p>
            `;
            processedTextPre.textContent = result.original_text;

        } catch (error) {
            console.error('Error during analysis:', error);
            riskScoreSpan.textContent = "Overall Risk Score: Error";
            concernsListDiv.innerHTML = `<p style="color: red;">Analysis failed: ${error.message}</p>`;
            processedTextPre.textContent = "";
            alert(`Analysis failed. See console for details: ${error.message}`);
        }
    });
});
