from Mason.nontouchingdetection import find_non_touching_loops
def calculate_delta_values(forward_paths, loops, loop_gains):
    """
    Calculate the delta value and individual delta values for each forward path
    using Mason's gain formula.
    
    Args:
        forward_paths: List of forward paths, where each path is a list of nodes
        loops: List of loops, where each loop is a list of nodes
        loop_gains: List of loop gains corresponding to each loop
        non_touching_loops: Dictionary of non-touching loop combinations
    
    Returns:
        Tuple of (delta, list of delta values for each forward path)
    """
    non_touching_loops = find_non_touching_loops(loops)
    print("Non-touching loops detected:", non_touching_loops)
    # Calculate the main delta value
    delta = 1.0
    
    # Subtract sum of all individual loop gains
    for i, gain in enumerate(loop_gains):
        delta -= gain
    
    # Add sum of products of gains of all combinations of two non-touching loops
    if 2 in non_touching_loops:
        for i, j in non_touching_loops[2]:
            delta += loop_gains[i] * loop_gains[j]
    
    # Subtract sum of products of gains of all combinations of three non-touching loops
    if 3 in non_touching_loops:
        for i, j, k in non_touching_loops[3]:
            delta -= loop_gains[i] * loop_gains[j] * loop_gains[k]
    
    # Add sum of products of gains of all combinations of four non-touching loops
    if 4 in non_touching_loops:
        for i, j, k, l in non_touching_loops[4]:
            delta += loop_gains[i] * loop_gains[j] * loop_gains[k] * loop_gains[l]
    
    # Subtract sum of products of gains of all combinations of five non-touching loops
    if 5 in non_touching_loops:
        for i, j, k, l, m in non_touching_loops[5]:
            delta -= loop_gains[i] * loop_gains[j] * loop_gains[k] * loop_gains[l] * loop_gains[m]
    
    # Calculate delta values for each forward path
    delta_values = []
    
    for path_idx, path in enumerate(forward_paths):
        # For each forward path, we need to remove loops that touch this path
        path_nodes = set(path)
        
        # Initialize delta value for this path
        path_delta = 1.0
        
        # Find loops that don't touch this path
        non_touching_path_loops = []
        non_touching_path_gains = []
        
        for loop_idx, loop in enumerate(loops):
            # Check if loop touches the path (remove last node which is duplicate of first)
            loop_nodes = set(loop[:-1])
            if len(path_nodes.intersection(loop_nodes)) == 0:
                non_touching_path_loops.append(loop)
                non_touching_path_gains.append(loop_gains[loop_idx])
        
        # If there are no non-touching loops, delta_k = 1
        if not non_touching_path_loops:
            delta_values.append(1.0)
            continue
        
        # Calculate delta_k similar to the main delta calculation but only with
        # loops that don't touch this path
        
        # Subtract sum of all individual non-touching loop gains
        for gain in non_touching_path_gains:
            path_delta -= gain
        
        # Find non-touching combinations within the non-touching path loops
        path_non_touching = find_non_touching_loops(non_touching_path_loops)
        
        # Map the original loop indices to the new indices in non_touching_path_loops
        loop_index_map = {loops.index(loop): i for i, loop in enumerate(non_touching_path_loops)}
        
        # Add sum of products of gains of combinations of two non-touching loops
        if 2 in path_non_touching:
            for i, j in path_non_touching[2]:
                path_delta += non_touching_path_gains[i] * non_touching_path_gains[j]
        
        # Subtract sum of products of gains of combinations of three non-touching loops
        if 3 in path_non_touching:
            for i, j, k in path_non_touching[3]:
                path_delta -= (non_touching_path_gains[i] * 
                              non_touching_path_gains[j] * 
                              non_touching_path_gains[k])
        
        # Add sum of products of gains of combinations of four non-touching loops
        if 4 in path_non_touching:
            for i, j, k, l in path_non_touching[4]:
                path_delta += (non_touching_path_gains[i] * 
                              non_touching_path_gains[j] * 
                              non_touching_path_gains[k] * 
                              non_touching_path_gains[l])
        
        # Subtract sum of products of gains of combinations of five non-touching loops
        if 5 in path_non_touching:
            for i, j, k, l, m in path_non_touching[5]:
                path_delta -= (non_touching_path_gains[i] * 
                              non_touching_path_gains[j] * 
                              non_touching_path_gains[k] * 
                              non_touching_path_gains[l] *
                              non_touching_path_gains[m])
        
        delta_values.append(path_delta)
    
    return delta, delta_values