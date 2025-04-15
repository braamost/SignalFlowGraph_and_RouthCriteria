def find_non_touching_loops(loops):
    """
    Find all combinations of non-touching loops in a signal flow graph.
    
    Args:
        loops: List of loops, where each loop is a list of nodes
    
    Returns:
        Dictionary with keys as the number of loops in combination (2, 3, etc.)
        and values as lists of tuples, where each tuple contains indices of non-touching loops
    """
    non_touching_loops = {2: [], 3: [], 4: [], 5: []}  # Store combinations by size
    
    # Check if two loops are non-touching
    def are_non_touching(loop1, loop2):
        # Remove the duplicate end node from each loop for comparison
        nodes1 = set(loop1[:-1])
        nodes2 = set(loop2[:-1])
        # If they share no common nodes, they are non-touching
        return len(nodes1.intersection(nodes2)) == 0
    
    # Find pairs of non-touching loops
    n_loops = len(loops)
    for i in range(n_loops):
        for j in range(i+1, n_loops):
            if are_non_touching(loops[i], loops[j]):
                non_touching_loops[2].append((i, j))
    
    # Find triplets of non-touching loops
    for i, j in non_touching_loops[2]:
        for k in range(max(i, j)+1, n_loops):
            if are_non_touching(loops[i], loops[k]) and are_non_touching(loops[j], loops[k]):
                non_touching_loops[3].append((i, j, k))
    
    # Find quadruplets of non-touching loops
    for i, j, k in non_touching_loops[3]:
        for l in range(max(i, j, k)+1, n_loops):
            if (are_non_touching(loops[i], loops[l]) and 
                are_non_touching(loops[j], loops[l]) and 
                are_non_touching(loops[k], loops[l])):
                non_touching_loops[4].append((i, j, k, l))
    
    # Find quintuplets of non-touching loops
    for i, j, k, l in non_touching_loops[4]:
        for m in range(max(i, j, k, l)+1, n_loops):
            if (are_non_touching(loops[i], loops[m]) and 
                are_non_touching(loops[j], loops[m]) and 
                are_non_touching(loops[k], loops[m]) and
                are_non_touching(loops[l], loops[m])):
                non_touching_loops[5].append((i, j, k, l, m))
    
    # Remove empty categories
    for key in list(non_touching_loops.keys()):
        if not non_touching_loops[key]:
            del non_touching_loops[key]
            
    return non_touching_loops