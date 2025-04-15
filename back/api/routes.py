from flask import Blueprint, request, jsonify
from services.signal_flow_graph import analyze_signal_flow_graph
from services.stability_analysis import routh_stability_analysis
from services.signal_flow_graph import convert_sympy_to_str
api_bp = Blueprint('api', __name__)

@api_bp.route('/analyze-graph', methods=['POST'])
def analyze_graph():
    """
    Analyze a signal flow graph
    Expected JSON input:
    {
        "nodes": [list of node IDs],
        "branches": [
            {"from": "node1", "to": "node2", "gain": 1.0}
        ]
    }
    """
    data = request.json
    try:
        result = analyze_signal_flow_graph(data['nodes'], data['branches'])
        safe_result = convert_sympy_to_str(result)
        print("Safe Result:", safe_result)
        return jsonify(safe_result) 
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@api_bp.route('/stability-analysis', methods=['POST'])
def stability():
    """
    Perform Routh stability analysis
    Expected JSON input:
    {
        "equation": "s^5+s^4+10s^3+72s^2+152s+240"
    }
    """
    data = request.json
    
    try:
        result = routh_stability_analysis(data['equation'])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

