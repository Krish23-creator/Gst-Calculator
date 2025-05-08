// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const amountInput = document.getElementById('amount');
    const gstRateInput = document.getElementById('gst-rate');
    const amountError = document.getElementById('amount-error');
    const gstRateError = document.getElementById('gst-rate-error');
    const gstAmountDisplay = document.getElementById('gst-amount');
    const totalAmountDisplay = document.getElementById('total-amount');
    const resultSummary = document.getElementById('result-summary');
    const resetButton = document.getElementById('reset-btn');
    const exclusiveBtn = document.getElementById('exclusive-btn');
    const inclusiveBtn = document.getElementById('inclusive-btn');
    const gstPresetBtns = document.querySelectorAll('.gst-preset-btn');
    
    // Set initial calculation mode (exclusive or inclusive)
    let isExclusiveMode = true;
    
    // Add event listeners for inputs and controls
    amountInput.addEventListener('input', calculateGST);
    gstRateInput.addEventListener('input', calculateGST);
    resetButton.addEventListener('click', resetCalculator);
    exclusiveBtn.addEventListener('click', () => setCalculationMode(true));
    inclusiveBtn.addEventListener('click', () => setCalculationMode(false));
    
    // Add event listeners for GST preset buttons
    gstPresetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the GST rate from the data attribute
            const rate = this.getAttribute('data-rate');
            
            // Update the GST rate input
            gstRateInput.value = rate;
            
            // Highlight the active preset button
            gstPresetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Calculate GST with the new rate
            calculateGST();
        });
    });
    
    /**
     * Set the calculation mode (exclusive or inclusive)
     * @param {boolean} isExclusive - Whether GST is exclusive (true) or inclusive (false)
     */
    function setCalculationMode(isExclusive) {
        isExclusiveMode = isExclusive;
        
        // Update toggle button styles
        if (isExclusive) {
            exclusiveBtn.classList.add('active');
            inclusiveBtn.classList.remove('active');
        } else {
            exclusiveBtn.classList.remove('active');
            inclusiveBtn.classList.add('active');
        }
        
        // Recalculate with the new mode
        calculateGST();
    }
    
    /**
     * Calculate GST based on input values and mode
     * Updates the result in real-time
     */
    function calculateGST() {
        // Validate inputs
        const amountValid = validateInput(amountInput, amountError, 'Amount must be a positive number');
        const gstRateValid = validateInput(gstRateInput, gstRateError, 'GST rate must be a positive number');
        
        // Clear results if inputs are invalid
        if (!amountValid || !gstRateValid) {
            if (!amountInput.value && !gstRateInput.value) {
                // If both fields are empty, show the default message
                updateResultsWithAnimation({
                    gstAmount: '₹0.00',
                    totalAmount: '₹0.00',
                    summary: 'Enter values to calculate'
                });
            }
            return;
        }
        
        // Parse input values
        const amount = parseFloat(amountInput.value);
        const gstRate = parseFloat(gstRateInput.value);
        
        let gstAmount, totalAmount;
        
        // Calculate based on the selected mode
        if (isExclusiveMode) {
            // Exclusive GST calculation (GST is added on top of the amount)
            gstAmount = (amount * gstRate) / 100;
            totalAmount = amount + gstAmount;
            
            // Update result summary for exclusive mode
            updateResultsWithAnimation({
                gstAmount: `₹${gstAmount.toFixed(2)}`,
                totalAmount: `₹${totalAmount.toFixed(2)}`,
                summary: `On ₹${amount.toFixed(2)}, GST @${gstRate}% = ₹${gstAmount.toFixed(2)}, total = ₹${totalAmount.toFixed(2)}`
            });
        } else {
            // Inclusive GST calculation (GST is included within the amount)
            gstAmount = amount - (amount * 100) / (100 + gstRate);
            totalAmount = amount;
            const basePrice = amount - gstAmount;
            
            // Update result summary for inclusive mode
            updateResultsWithAnimation({
                gstAmount: `₹${gstAmount.toFixed(2)}`,
                totalAmount: `₹${totalAmount.toFixed(2)}`,
                summary: `Of ₹${amount.toFixed(2)}, GST @${gstRate}% = ₹${gstAmount.toFixed(2)}, you pay ₹${totalAmount.toFixed(2)} (incl. GST)`
            });
        }
    }
    
    /**
     * Validate input to ensure it's a positive number
     * @param {HTMLElement} inputElement - The input element to validate
     * @param {HTMLElement} errorElement - The error message element
     * @param {string} errorMessage - The error message to display
     * @return {boolean} - Whether the input is valid
     */
    function validateInput(inputElement, errorElement, errorMessage) {
        // Clear previous error
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
        
        // If the input is empty, it's valid (but won't trigger a calculation)
        if (!inputElement.value) {
            return false;
        }
        
        const value = inputElement.value;
        
        // Check if the input is a valid positive number
        if (isNaN(value) || parseFloat(value) < 0) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('visible');
            return false;
        }
        
        return true;
    }
    
    /**
     * Update all result displays with fade out/in animation
     * @param {Object} results - Object containing the new result values
     */
    function updateResultsWithAnimation(results) {
        // Add fade-out class to all result elements
        gstAmountDisplay.classList.add('fade-out');
        totalAmountDisplay.classList.add('fade-out');
        resultSummary.classList.add('fade-out');
        
        // After the fade-out animation completes, update the text and fade in
        setTimeout(() => {
            gstAmountDisplay.textContent = results.gstAmount;
            totalAmountDisplay.textContent = results.totalAmount;
            resultSummary.textContent = results.summary;
            
            gstAmountDisplay.classList.remove('fade-out');
            totalAmountDisplay.classList.remove('fade-out');
            resultSummary.classList.remove('fade-out');
            
            gstAmountDisplay.classList.add('fade-in');
            totalAmountDisplay.classList.add('fade-in');
            resultSummary.classList.add('fade-in');
            
            // Remove the fade-in class after animation completes
            setTimeout(() => {
                gstAmountDisplay.classList.remove('fade-in');
                totalAmountDisplay.classList.remove('fade-in');
                resultSummary.classList.remove('fade-in');
            }, 300);
        }, 300);
    }
    
    /**
     * Reset all inputs and the result
     * Also adds animations to the reset button
     * @param {Event} e - The click event
     */
    function resetCalculator(e) {
        // Clear input fields
        amountInput.value = '';
        gstRateInput.value = '';
        
        // Clear error messages
        amountError.textContent = '';
        amountError.classList.remove('visible');
        gstRateError.textContent = '';
        gstRateError.classList.remove('visible');
        
        // Remove active class from GST preset buttons
        gstPresetBtns.forEach(btn => btn.classList.remove('active'));
        
        // Reset results with animation
        updateResultsWithAnimation({
            gstAmount: '₹0.00',
            totalAmount: '₹0.00',
            summary: 'Enter values to calculate'
        });
        
        // Create ripple effect
        createRippleEffect(e);
        
        // Add bounce animation to the button
        resetButton.classList.add('bounce');
        setTimeout(() => {
            resetButton.classList.remove('bounce');
        }, 400);
    }
    
    /**
     * Create a ripple effect on button click
     * @param {Event} e - The click event
     */
    function createRippleEffect(e) {
        const button = e.currentTarget;
        
        // Get button position
        const rect = button.getBoundingClientRect();
        
        // Calculate click position relative to button
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.top = `${y}px`;
        ripple.style.left = `${x}px`;
        
        // Add ripple to button
        button.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});