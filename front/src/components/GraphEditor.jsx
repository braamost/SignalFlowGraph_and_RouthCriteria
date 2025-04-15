import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { analyzeGraph } from '../services/api';

const CustomNode = ({ data }) => {
  return (
    <div style={{ 
      padding: '10px', 
      border: '1px solid #000', 
      borderRadius: '50px',
      background: 'white',
      textAlign: 'center',
      minWidth: '25px',
    }}>
      <Handle
        id = "top"
        type="source"
        position={Position.Top}
        style={{ width: '10px', height: '10px' }}
      />
      <Handle
        id = "bottom"
        type="source"
        position={Position.Bottom}
        style={{ width: '10px', height: '10px' }}
      />
      <Handle
        id = "left"
        type="target"
        position={Position.Left}
        style={{ width: '10px', height: '10px' }}
      />
      {data.label}
      <Handle
        id = "right"
        type="source"
        position={Position.Right}
        style={{ width: '10px', height: '10px' }}
      />
    </div>
  );
};
const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = ['default', 'straight', 'step', 'smoothstep', 'bezier'];

function GraphEditor({ onResultsReceived }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeName, setNodeName] = useState('');
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeGain, setEdgeGain] = useState('1.0');
  const [edgeType, setEdgeType] = useState('bezier');

  const onConnect = useCallback((params) => {
    if (params.source === params.target) {
      console.log("Cannot connect a node to itself");
      return;
    }
  
    const sourcePos = params.sourceHandle || 'right';
    const targetPos = params.targetHandle || 'left';
  
    const isValidConnection = (
      (sourcePos === 'top' && targetPos === 'left') ||
      (sourcePos === 'right' && targetPos === 'left') ||
      (sourcePos === 'bottom' && targetPos === 'left')
    );
  
    if (isValidConnection) {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}-${sourcePos}-${targetPos}`,
        label: '1.0',
        type: edgeType,
        markerEnd: { type: MarkerType.ArrowClosed }
      };
  
      setEdges((eds) => addEdge(newEdge, eds));
    } else {
      console.log('Invalid connection combination');
    }
  }, [setEdges, edgeType]);
  
  const addNode = () => {
    if (!nodeName) return;
    const newId = (nodes.length + 1).toString();
    const newNode = {
      id: newId,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 },
      data: { label: nodeName },
      type: 'custom', 
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeName('');
  };

  const selectEdge = (edge) => {
    setSelectedEdge(edge);
    setEdgeGain(edge.label || '1.0');
    setEdgeType(edge.type || 'bezier');
  };

  const updateEdgeGain = () => {
    
    if (!selectedEdge) return;
    setEdges((eds) =>
      eds.map((e) =>
        e.id === selectedEdge.id
          ? { ...e, label: edgeGain, type: edgeType }
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
          gain: (edge.label) || 1.0
        }))
      };
      console.log(graphData);
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
              <select 
                value={edgeType}
                onChange={(e) => setEdgeType(e.target.value)}
              >
                {edgeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <button onClick={updateEdgeGain}>Update</button>
              <button onClick={() => setSelectedEdge(null)}>Cancel</button>
            </>
          ) : (
            <p>Select an edge to edit it</p>
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
          nodeTypes={nodeTypes}
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