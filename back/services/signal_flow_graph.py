import networkx as nx
import numpy as np
import sympy as sp
from Mason.mason import mason_gain
from Mason.DeltaCalculations import calculate_delta_values
from sympy import Basic

def analyze_signal_flow_graph(nodes, branches):
    """
    Analyze a signal flow graph to find:
    1. All forward paths
    2. Individual loops
    3. Non-touching loops
    4. Delta values
    5. Overall transfer function
    
    Args:
        nodes: List of node IDs
        branches: List of branch objects with from, to, and gain properties
    
    Returns:
        Dictionary with analysis results
    """
    # Create a directed graph
    G = nx.DiGraph()
    
    # Add nodes and edges
    for node in nodes:
        G.add_node(node)
        
    for branch in branches:
        if isinstance(branch['gain'], str):
            gain = sp.Symbol(branch['gain'])
        else:
            gain = branch['gain']
        G.add_edge(branch['from'], branch['to'], weight=gain)
    # Find forward paths (assuming first node is input and last node is output)
    source = nodes[0]
    sink = nodes[-1]
    forward_paths = list(nx.all_simple_paths(G, source=source, target=sink))
    print("Forward Paths:", forward_paths)
    # Calculate forward path gains
    forward_path_gains = []
    for path in forward_paths:
        gain = 1.0
        for i in range(len(path) - 1):
            edge_data = G.get_edge_data(path[i], path[i+1])
            gain *= edge_data['weight']
        forward_path_gains.append(gain)
    print("Forward Path Gains:", forward_path_gains)
    # Find all loops
    loops = []
    for cycle in nx.simple_cycles(G):
        if len(cycle) > 1:  # Exclude self-loops
            # Add the start node at the end to represent the cycle
            cycle_with_return = cycle + [cycle[0]]
            loops.append(cycle_with_return)
    
    # Calculate loop gains
    loop_gains = []
    for loop in loops:
        gain = 1.0
        for i in range(len(loop) - 1):
            edge_data = G.get_edge_data(loop[i], loop[i+1])
            gain *= edge_data['weight']
        loop_gains.append(gain)
    
    # TODO: Implement non-touching loops detection
    # TODO: Calculate delta values
    # TODO: Calculate transfer function // finished 
    
    # Placeholder for now
    delta = 1.0
    delta_values = [1.0] * len(forward_paths)
    delta , delta_values = calculate_delta_values(forward_paths, loops, loop_gains)
    transfer_function = mason_gain(forward_paths, forward_path_gains, loops, loop_gains, delta, delta_values)

    if not isinstance(transfer_function, (int, float)):
        transfer_function = sp.simplify(transfer_function)
    print("Transfer Function:", transfer_function)
    print("Delta:", delta)
    print("Delta Values:", delta_values)
    return {
        "forward_paths": forward_paths,
        "forward_path_gains": forward_path_gains,
        "loops": loops,
        "loop_gains": loop_gains,
        "delta": delta,
        "delta_values": delta_values,
        "transfer_function": transfer_function
    }

def convert_sympy_to_str(obj):
    if isinstance(obj, Basic):  
        return str(obj)
    elif isinstance(obj, list):
        return [convert_sympy_to_str(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_sympy_to_str(v) for k, v in obj.items()}
    else:
        return obj