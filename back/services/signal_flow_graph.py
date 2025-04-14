import networkx as nx
import numpy as np

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
        G.add_edge(branch['from'], branch['to'], weight=branch['gain'])
    
    # Find forward paths (assuming first node is input and last node is output)
    source = nodes[0]
    sink = nodes[-1]
    forward_paths = list(nx.all_simple_paths(G, source=source, target=sink))
    
    # Calculate forward path gains
    forward_path_gains = []
    for path in forward_paths:
        gain = 1.0
        for i in range(len(path) - 1):
            edge_data = G.get_edge_data(path[i], path[i+1])
            gain *= edge_data['weight']
        forward_path_gains.append(gain)
    
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
    # TODO: Calculate transfer function
    
    # Placeholder for now
    delta = 1.0
    delta_values = [1.0] * len(forward_paths)
    transfer_function = "Placeholder"
    
    return {
        "forward_paths": forward_paths,
        "forward_path_gains": forward_path_gains,
        "loops": loops,
        "loop_gains": loop_gains,
        "delta": delta,
        "delta_values": delta_values,
        "transfer_function": transfer_function
    }