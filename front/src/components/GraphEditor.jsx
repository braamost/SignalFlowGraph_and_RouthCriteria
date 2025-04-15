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
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { analyzeGraph } from '../services/api';

// Smaller Custom Node with simplified design
const CustomNode = ({ data }) => {
  return (
    <div style={{ 
      padding: '6px 10px', 
      border: '1px solid #3366FF', 
      borderRadius: '16px',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      minWidth: '25px',
      fontSize: '12px',
      fontWeight: '500',
    }}>
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        style={{ width: '6px', height: '6px', background: '#3366FF' }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{ width: '6px', height: '6px', background: '#3366FF' }}
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        style={{ width: '6px', height: '6px', background: '#3366FF' }}
      />
      {data.label}
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{ width: '6px', height: '6px', background: '#3366FF' }}
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
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#3366FF', strokeWidth: 1.5 }
      };
  
      setEdges((eds) => addEdge(newEdge, eds));
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

  const deleteEdge = () => {
    if (!selectedEdge) return;
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
    setSelectedEdge(null);
  };

  const updateEdgeGain = () => {
    if (!selectedEdge) return;
    
    setEdges((eds) =>
      eds.map((e) =>
        e.id === selectedEdge.id
          ? { 
              ...e, 
              label: edgeGain, 
              type: edgeType,
              style: { stroke: '#3366FF', strokeWidth: 1.5 }
            }
          : e
      )
    );
    setSelectedEdge(null);
    setEdgeGain('1.0');
  };

  const clearGraph = () => {
    if (window.confirm('Are you sure you want to clear the graph?')) {
      setNodes([]);
      setEdges([]);
      setSelectedEdge(null);
    }
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
      window.scrollTo({
        top: 100000,
        left: 100000,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error('Error analyzing graph:', error);
      alert('Error analyzing graph. See console for details.');
    }
  };

  return (
    <div className="graph-editor" style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      width: '100%', 
      margin: '0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      background: 'white'
    }}>
      <div style={{
        background: '#f0f4f8',
        padding: '10px 20px',
        borderBottom: '1px solid #eaeef2',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center'
      }}>
        <div style={{
          flex: '1 1 400px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          background: 'white',
          padding: '8px 12px',
          borderRadius: '6px'
        }}>
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Node Name"
            onKeyPress={(e) => e.key === 'Enter' && addNode()}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={addNode}
            style={{
              padding: '6px 12px',
              background: '#3366FF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            Add Node
          </button>
        </div>
        
        <div style={{
          flex: '2 1 600px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          background: 'white',
          padding: '8px 12px',
          borderRadius: '6px'
        }}>
          {selectedEdge ? (
            <>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Gain:</span>
              <input
                type="text"
                value={edgeGain}
                onChange={(e) => setEdgeGain(e.target.value)}
                placeholder="Gain"
                style={{
                  width: '70px',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px'
                }}
              />
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Type:</span>
              <select 
                value={edgeType}
                onChange={(e) => setEdgeType(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px'
                }}
              >
                {edgeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <button 
                onClick={updateEdgeGain}
                style={{
                  padding: '6px 12px',
                  background: '#3366FF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                Update
              </button>
              <button
              onClick={deleteEdge}
              style={{
                padding: '6px 12px',
                background: '#f56565',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
              >
                Delete
              </button>
              <button 
                onClick={() => setSelectedEdge(null)}
                style={{
                  padding: '6px 12px',
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <span style={{ 
              color: '#a0aec0', 
              fontStyle: 'italic',
              fontSize: '14px'
            }}>
              Click on an edge to edit it
            </span>
          )}
        </div>
      </div>
      
      <div style={{ height: 680, width: '100%', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={(_, edge) => selectEdge(edge)}
          fitView
          style={{ background: '#f9fafc', borderColor: '#e2e8f0', borderWidth: '0.5px', borderStyle: 'solid', borderRadius: '10px' }}
        >
          <Controls />
          <Background color="#aaa" gap={16} size={1} />
          
          <Panel position="top-right" style={{
            display: 'flex',
            gap: '8px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '6px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={analyzeCurrentGraph}
              style={{
                padding: '8px 16px',
                background: '#3366FF',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              Analyze
            </button>
            
            <button
              onClick={clearGraph}
              style={{
                padding: '8px 16px',
                background: '#f56565',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Clear
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export default GraphEditor;