import numpy as np
import re

def parse_characteristic_equation(equation):
    """
    Parse a characteristic equation string into a list of coefficients.
    Example: "s^5+s^4+10s^3+72s^2+152s+240" becomes [1, 1, 10, 72, 152, 240]
    
    Args:
        equation: String representation of the characteristic equation
    
    Returns:
        List of coefficients in descending order of powers
    """
    # Remove spaces
    equation = equation.replace(" ", "")
    
    # Find all terms with their coefficients and powers
    terms = re.findall(r'([+-]?\s*\d*)\s*s\^?(\d*)', equation)
    
    # Add constant term if present
    constant_match = re.search(r'([+-]?\s*\d+)$', equation)
    constant = 0
    if constant_match:
        constant = int(constant_match.group(1))
    
    # Find the highest power
    highest_power = 0
    for _, power in terms:
        if power and int(power) > highest_power:
            highest_power = int(power)
            
    # Initialize coefficients array
    coefficients = [0] * (highest_power + 1)
    
    # Fill coefficients
    for coef, power in terms:
        if coef == '' or coef == '+':
            coef = 1
        elif coef == '-':
            coef = -1
        else:
            coef = int(coef)
            
        if power == '':
            # This is the s^1 term
            coefficients[highest_power - 1] = coef
        else:
            power = int(power)
            coefficients[highest_power - power] = coef
            
    # Add constant term
    if highest_power > 0:
        coefficients[highest_power] = constant
        
    return coefficients

def routh_stability_analysis(equation):
    """
    Perform Routh stability analysis on a characteristic equation.
    
    Args:
        equation: String representation of the characteristic equation
    
    Returns:
        Dictionary with stability status and details
    """
    coefficients = parse_characteristic_equation(equation)
    
    # Build Routh array
    n = len(coefficients)
    routh_array = np.zeros((n, (n + 1) // 2))
    
    # Fill first two rows with coefficients
    for i in range(0, (n + 1) // 2):
        if 2 * i < n:
            routh_array[0, i] = coefficients[2 * i]
        if 2 * i + 1 < n:
            routh_array[1, i] = coefficients[2 * i + 1]
    
    # Calculate remaining rows
    for i in range(2, n):
        for j in range((n + 1) // 2 - 1):
            if routh_array[i-1, 0] == 0:
                # Special case: zero in first column
                # Replace with epsilon or use derivative
                routh_array[i-1, 0] = 1e-10
                
            routh_array[i, j] = (
                routh_array[i-1, 0] * routh_array[i-2, j+1] - 
                routh_array[i-2, 0] * routh_array[i-1, j+1]
            ) / routh_array[i-1, 0]
    
    # Check for sign changes in first column
    first_column = routh_array[:, 0]
    sign_changes = 0
    
    for i in range(1, len(first_column)):
        if first_column[i-1] * first_column[i] < 0:
            sign_changes += 1
    
    is_stable = sign_changes == 0 and np.all(first_column != 0)
    
    # Calculate number of RHS poles if unstable
    rhs_poles = sign_changes
    
    # TODO: Implement pole value calculation if unstable
    # This would require solving the characteristic equation
    
    return {
        "is_stable": is_stable,
        "routh_array": routh_array.tolist(),
        "sign_changes": sign_changes,
        "rhs_poles": rhs_poles,
        "pole_values": [] if is_stable else ["Not implemented yet"]
    }
