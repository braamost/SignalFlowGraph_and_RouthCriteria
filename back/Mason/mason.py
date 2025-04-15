

def mason_gain(forward_paths, forward_path_gains, loops, loop_gains, delta, delta_values):
    """
    Compute the overall transfer function using Mason's Gain Formula.

    Parameters:
    - forward_paths: List of forward paths (not used directly in computation, for reference)
    - forward_path_gains: List of gains for each forward path [P1, P2, ...]
    - loops: List of loops (not used directly, for reference)
    - loop_gains: List of individual loop gains
    - delta: Overall delta of the system
    - delta_values: List of delta values corresponding to each forward path [Δ1, Δ2, ...]

    Returns:
    - Transfer function T (float or symbolic, depending on input)
    """

    if len(forward_path_gains) != len(delta_values):
        raise ValueError("Mismatch between number of forward path gains and delta values.")

    numerator = sum(P * D for P, D in zip(forward_path_gains, delta_values))
    transfer_function = numerator / delta

    return transfer_function
