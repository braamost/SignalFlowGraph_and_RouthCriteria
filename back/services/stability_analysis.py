import numpy as np

def routh_stability_analysis(equation, degree):
    """
    Perform Routh stability analysis on a characteristic equation.
    Args:
        equation: List of coefficients from highest power to lowest
        degree: Degree of the polynomial
    Returns:
        Dictionary with stability status and details
    """
    n = int(degree + 1)  # Number of coefficients
    coefficients = equation
    
    # Ensure we have the right number of coefficients
    if len(coefficients) != n:
        return {"error": f"Expected {n} coefficients for degree {degree}, got {len(coefficients)}"}
    
    # Initialize Routh array
    routh_array = np.zeros((n, (n + 1) // 2))
    
    # Fill first two rows with coefficients
    counter1, counter2 = 0, 0
    for i in range(n):
        if i % 2 == 0:
            routh_array[0, counter1] = float(coefficients[i])
            counter1 += 1
        else:
            routh_array[1, counter2] = float(coefficients[i])
            counter2 += 1
    
    # Calculate remaining rows
    for i in range(2, n):
        # Check if previous row is all zeros
        if np.all(np.abs(routh_array[i-1, :]) < 1e-10):
            # Replace with derivative of the row above it
            for j in range((n + 1) // 2 - 1):
                if j + (i-2)//2 + 1 < (n+1)//2:  # Ensure we're within array bounds
                    # Calculate coefficient for the auxiliary polynomial
                    power = degree - (i-2) - 2*j
                    if power >= 0:
                        routh_array[i-1, j] = routh_array[i-2, j] * power
        
        # Check if first element is zero (or very small)
        if abs(routh_array[i-1, 0]) < 1e-10:
            routh_array[i-1, 0] = 1e-6  # Replace with small value
        
        # Calculate the row
        for j in range((n + 1) // 2 - 1):
            if j+1 < (n+1)//2:  # Ensure we don't go out of bounds
                try:
                    routh_array[i, j] = (
                        routh_array[i-1, 0] * routh_array[i-2, j+1] - 
                        routh_array[i-2, 0] * routh_array[i-1, j+1]
                    ) / routh_array[i-1, 0]
                except:
                    routh_array[i, j] = 0  # Handle any calculation errors
    
    # Check for sign changes in first column
    first_column = routh_array[:, 0]
    sign_changes = 0
    
    # Filter out zero values for sign change calculation
    nonzero_elements = [val for val in first_column if abs(val) > 1e-10]
    
    for i in range(1, len(nonzero_elements)):
        if nonzero_elements[i-1] * nonzero_elements[i] < 0:
            sign_changes += 1
    
    is_stable = sign_changes == 0 and all(abs(val) > 1e-10 for val in first_column)
    
    return {
        "is_stable": is_stable,
        "routh_array": routh_array.tolist(),
        "rhs_poles": sign_changes,
    }
