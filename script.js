document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const isShowing = navLinks.classList.contains('show');
            mobileBtn.innerHTML = isShowing 
                ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                : '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });
    }

    // Detection Form Logic
    const form = document.getElementById('detection-form');
    if (form) {
        const analyzeBtn = document.getElementById('analyze-btn');
        const textInput = document.getElementById('article-text');
        const inputSection = document.getElementById('input-section');
        const resultSection = document.getElementById('result-section');
        const resetBtn = document.getElementById('reset-btn');
        
        // Results elements
        const resultBadge = document.getElementById('result-badge');
        const confidenceScore = document.getElementById('confidence-score');
        const factorsList = document.getElementById('factors-list');

        function generateMockResult(text) {
            // Very basic mockup logic based on length and some keywords
            const lowerText = text.toLowerCase();
            const fakeKeywords = ['shocking', 'secret', 'conspiracy', 'never seen before', 'they don\'t want you to know', 'miracle', '100% true'];
            const realKeywords = ['according to', 'researchers', 'stated', 'reported by', 'study', 'official'];
            
            let fakeScore = 0;
            let realScore = 0;

            fakeKeywords.forEach(kw => { if (lowerText.includes(kw)) fakeScore += 20; });
            realKeywords.forEach(kw => { if (lowerText.includes(kw)) realScore += 15; });

            // Randomness to simulate AI
            const baseConfidence = Math.floor(Math.random() * 40) + 50; // 50 to 90
            let isFake = false;
            let confidence = baseConfidence;

            if (fakeScore > realScore || text.length < 100) {
                isFake = true;
                confidence = Math.min(99, baseConfidence + fakeScore);
            } else {
                isFake = false;
                confidence = Math.min(99, baseConfidence + realScore);
            }

            // Generate Factors
            const factors = [];
            if (isFake) {
                factors.push({ label: 'High use of emotional/hyperbolic adjectives', score: '87% match' });
                if (text.length < 100) factors.push({ label: 'Insufficient detail for factual reporting', score: '92% match' });
                factors.push({ label: 'Lack of credible citations', score: '78% match' });
            } else {
                factors.push({ label: 'Neutral linguistic tone', score: '82% match' });
                factors.push({ label: 'Structure aligns with journalistic standards', score: '90% match' });
                factors.push({ label: 'Presence of verifiable entities', score: '76% match' });
            }

            return { isFake, confidence, factors };
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const text = textInput.value.trim();
            if (!text) {
                alert("Please enter some text to analyze.");
                textInput.focus();
                return;
            }

            // Simulate loading state
            const originalBtnHtml = analyzeBtn.innerHTML;
            analyzeBtn.innerHTML = `<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Analyzing...`;
            analyzeBtn.disabled = true;
            analyzeBtn.style.opacity = '0.7';

            // Simulate network delay
            setTimeout(() => {
                const result = generateMockResult(text);
                
                // Update UI with results
                if (result.isFake) {
                    resultBadge.className = 'status-badge fake';
                    resultBadge.innerHTML = '⚠️ High Probability of Fake News';
                } else {
                    resultBadge.className = 'status-badge real';
                    resultBadge.innerHTML = '✅ Likely Credible Information';
                }
                
                confidenceScore.textContent = `${result.confidence}%`;

                factorsList.innerHTML = result.factors.map(f => {
                    const percentage = f.score.replace('% match', '');
                    const color = result.isFake ? 'var(--danger)' : 'var(--success)';
                    return `
                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; border-left: 4px solid ${color};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                            <span style="font-size: 0.95rem;">${f.label}</span>
                            <span style="font-weight: 700; font-family: 'Outfit'; color: ${color};">${f.score}</span>
                        </div>
                        <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; position: relative;">
                            <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${percentage}%; background: ${color}; border-radius: 3px; transform-origin: left; animation: slideIn 1s ease-out forwards;"></div>
                        </div>
                    </div>
                    `;
                }).join('');

                // Transition views
                inputSection.style.display = 'none';
                resultSection.style.display = 'block';
                // Trigger reflow for transition
                void resultSection.offsetWidth;
                resultSection.style.opacity = '1';
                resultSection.style.transform = 'translateY(0)';

                // Reset button
                analyzeBtn.innerHTML = originalBtnHtml;
                analyzeBtn.disabled = false;
                analyzeBtn.style.opacity = '1';

            }, 1800); // 1.8s mock delay
        });

        resetBtn.addEventListener('click', () => {
            resultSection.style.opacity = '0';
            resultSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                resultSection.style.display = 'none';
                inputSection.style.display = 'block';
                textInput.value = '';
                textInput.focus();
            }, 500);
        });
    }

    // Dataset Parser Logic
    const csvInput = document.getElementById('csv-upload');
    const datasetBody = document.getElementById('dataset-body');
    const statTotal = document.getElementById('stat-total');
    const statReal = document.getElementById('stat-real');
    const statFake = document.getElementById('stat-fake');

    if (csvInput && datasetBody) {
        csvInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                const text = event.target.result;
                processData(text);
            };
            reader.readAsText(file);
        });

        function processData(csv) {
            // Very simple CSV parser: split by newline, then split by commas. 
            // Doesn't handle quotes escaping commas inside fields accurately for full complexity.
            const lines = csv.split('\n').filter(line => line.trim().length > 0);
            if (lines.length < 2) {
                alert("The CSV file seems to be empty or missing data rows.");
                return;
            }

            const headers = lines[0].split(',');
            // Auto detect Label column index (default to last column if not explicitly named)
            let labelIdx = headers.findIndex(h => h.trim().toLowerCase() === 'label');
            if (labelIdx === -1) labelIdx = headers.length - 1;

            let realCount = 0;
            let fakeCount = 0;
            let newHtml = '';

            // Cap display at 50 rows for performance
            const maxRows = Math.min(lines.length, 51); 

            for (let i = 1; i < maxRows; i++) {
                const currentLine = lines[i].split(',');
                if (currentLine.length < 2) continue; // skip malformed lines

                const label = currentLine[labelIdx] ? currentLine[labelIdx].trim().toUpperCase() : 'UNKNOWN';
                const isReal = label === 'REAL' || label === 'TRUE' || label === '1';
                
                if (isReal) realCount++;
                else fakeCount++;

                const headline = currentLine[0] || 'Unknown Headline';
                const subject = currentLine[1] || 'General';
                const date = currentLine[2] || 'N/A';

                const bgClass = i % 2 === 1 ? 'background: rgba(255,255,255,0.02);' : '';
                const badgeClass = isReal ? 'real' : 'fake';
                const displayLabel = isReal ? 'REAL' : 'FAKE';

                newHtml += `
                    <tr style="border-bottom: 1px solid var(--surface-border); ${bgClass}">
                        <td style="padding: 1rem;">${headline}</td>
                        <td style="padding: 1rem; color: var(--text-muted);">${subject}</td>
                        <td style="padding: 1rem; color: var(--text-muted);">${date}</td>
                        <td style="padding: 1rem;"><span class="status-badge ${badgeClass}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">${displayLabel}</span></td>
                    </tr>
                `;
            }

            // Update DOM
            datasetBody.innerHTML = newHtml;

            // Update stats
            const total = realCount + fakeCount;
            if (total > 0) {
                statTotal.textContent = total;
                statTotal.classList.remove('text-gradient'); // Change style slightly to indicate local
                statTotal.style.color = 'var(--text-main)';
                statReal.textContent = Math.round((realCount / total) * 100) + '%';
                statFake.textContent = Math.round((fakeCount / total) * 100) + '%';
            }
            
            // Allow re-uploading the same file
            csvInput.value = '';
        }
    }
});

// Add keyframes for the spinner dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
