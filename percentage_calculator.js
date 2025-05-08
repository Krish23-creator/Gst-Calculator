// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const baseValueInput = document.getElementById('base-value');
    const percentageInput = document.getElementById('percentage');
    const baseValueError = document.getElementById('base-value-error');
    const percentageError = document.getElementById('percentage-error');
    const resultDisplay = document.getElementById('result-value');
    const resetButton = document.getElementById('reset-btn');
    
    // Add event listeners for input changes
    baseValueInput.addEventListener('input', calculatePercentage);
    percentageInput.addEventListener('input', calculatePercentage);
    resetButton.addEventListener('click', resetCalculator);
    
    /**
     * Calculate the percentage based on input values
     * Updates the result in real-time
     */
    function calculatePercentage() {
        // Validate inputs
        const baseValueValid = validateInput(baseValueInput, baseValueError, 'Base value must be a positive number');
        const percentageValid = validateInput(percentageInput, percentageError, 'Percentage must be a positive number');
        
        // If both inputs are valid, calculate and display result
        if (baseValueValid && percentageValid) {
            const baseValue = parseFloat(baseValueInput.value);
            const percentage = parseFloat(percentageInput.value);
            
            // Calculate the result
            const result = (baseValue * percentage) / 100;
            
            // Update the result with animation
            updateResultWithAnimation(`${percentage}% of ${baseValue} = ${result.toFixed(2)}`);
        } else if (!baseValueInput.value && !percentageInput.value) {
            // If both fields are empty, show the default message
            updateResultWithAnimation("Enter values to calculate");
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
     * Update the result with a fade out/in animation
     * @param {string} newValue - The new value to display
     */
    function updateResultWithAnimation(newValue) {
        // Add fade-out class
        resultDisplay.classList.add('fade-out');
        
        // After the fade-out animation completes, update the text and fade in
        setTimeout(() => {
            resultDisplay.textContent = newValue;
            resultDisplay.classList.remove('fade-out');
            resultDisplay.classList.add('fade-in');
            
            // Remove the fade-in class after animation completes
            setTimeout(() => {
                resultDisplay.classList.remove('fade-in');
            }, 300);
        }, 300);
    }
    
    /**
     * Reset all inputs and the result
     * Also adds a ripple animation to the reset button
     * @param {Event} e - The click event
     */
    function resetCalculator(e) {
        // Clear input fields
        baseValueInput.value = '';
        percentageInput.value = '';
        
        // Clear error messages
        baseValueError.textContent = '';
        baseValueError.classList.remove('visible');
        percentageError.textContent = '';
        percentageError.classList.remove('visible');
        
        // Reset result with animation
        updateResultWithAnimation("Enter values to calculate");
        
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