import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { analyzeGraph } from '../services/api';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 300, y: 100 }, data: { label: 'Node 2' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: '1.0' },
];

function GraphEditor({ onResultsReceived }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeGain, setEdgeGain] = useState('1.0');

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      label: '1.0',
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const addNode = () => {
    if (!nodeName) return;
    
    const newId = (nodes.length + 1).toString();
    const newNode = {
      id: newId,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 },
      data: { label: nodeName },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNodeName('');
  };

  const selectEdge = (edge) => {
    setSelectedEdge(edge);
    setEdgeGain(edge.label || '1.0');
  };

  const updateEdgeGain = () => {
    if (!selectedEdge) return;
    
    setEdges((eds) => 
      eds.map((e) => 
        e.id === selectedEdge.id 
          ? { ...e, label: edgeGain } 
          : e
      )
    );
    
    setSelectedEdge(null);
    setEdgeGain('1.0');
  };

  const analyzeCurrentGraph = async () => {
    try {
      const graphData = {
        nodes: nodes.map(node => node.id),
        branches: edges.map(edge => ({
          from: edge.source,
          to: edge.target,
          gain: parseFloat(edge.label) || 1.0
        }))
      };
      
      const results = await analyzeGraph(graphData);
      onResultsReceived(results);
    } catch (error) {
      console.error('Error analyzing graph:', error);
      alert('Error analyzing graph. See console for details.');
    }
  };

  return (
    <div className="graph-editor">
      <div className="controls-panel">
        <div className="node-controls">
          <h3>Add Node</h3>
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Node Name"
          />
          <button onClick={addNode}>Add Node</button>
        </div>
        
        <div className="edge-controls">
          <h3>Edit Edge</h3>
          {selectedEdge ? (
            <>
              <p>Editing edge: {selectedEdge.source} → {selectedEdge.target}</p>
              <input
                type="text"
                value={edgeGain}
                onChange={(e) => setEdgeGain(e.target.value)}
                placeholder="Gain"
              />
              <button onClick={updateEdgeGain}>Update Gain</button>
              <button onClick={() => setSelectedEdge(null)}>Cancel</button>
            </>
          ) : (
            <p>Select an edge to edit its gain</p>
          )}
        </div>
        
        <button className="analyze-button" onClick={analyzeCurrentGraph}>
          Analyze Graph
        </button>
      </div>
      
      <div className="flow-container" style={{ height: 500 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={(_, edge) => selectEdge(edge)}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default GraphEditor;
