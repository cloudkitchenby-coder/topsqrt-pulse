import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import {
  SystemState,
  ClientRecord,
  AuditLogEntry,
  FollowUpTask,
  MovementRule,
  findMovementRule,
  generateId,
  calculatePriority,
  getRandomClient,
  getRandomResult,
} from '@/lib/autoUpdateEngine';
import { mockClients, initialOfficerBoxes, initialUserBoxes } from '@/lib/mockData';

// Action types
type SystemAction =
  | { type: 'MOVE_CLIENT'; payload: { clientId: string; fromBox: string; toBox: string; result: 'done' | 'follow-up' | 'pending'; remark: string; userName: string } }
  | { type: 'UPDATE_BOX_COUNT'; payload: { boxId: string; delta: number } }
  | { type: 'ADD_AUDIT_LOG'; payload: AuditLogEntry }
  | { type: 'ADD_FOLLOW_UP'; payload: FollowUpTask }
  | { type: 'UPDATE_COLLECTION'; payload: { amount: number } }
  | { type: 'SET_DEMO_MODE'; payload: boolean }
  | { type: 'RUN_HEALTH_CHECK' }
  | { type: 'SET_SYSTEM_HEALTH'; payload: 'healthy' | 'syncing' | 'attention-needed' }
  | { type: 'SIMULATE_ACTION'; payload: { boxId: string } };

// Initialize clients from mock data
const initializeClients = (): Record<string, ClientRecord> => {
  const clients: Record<string, ClientRecord> = {};
  const allBoxes = [...initialOfficerBoxes, ...initialUserBoxes];
  
  let clientIndex = 0;
  allBoxes.forEach(box => {
    const count = box.count || 0;
    for (let i = 0; i < count && clientIndex < mockClients.length; i++) {
      const mockClient = mockClients[clientIndex];
      const client: ClientRecord = {
        id: mockClient.id,
        name: mockClient.name,
        unit: mockClient.unit,
        phone: mockClient.phone,
        area: mockClient.area,
        status: 'active',
        currentBox: box.id,
        serviceType: 'Standard',
        startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        pendingAmount: mockClient.amount,
        lastActionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        attemptCount: Math.floor(Math.random() * 3),
        assignedOfficer: 'Sandeep Sachdeva',
      };
      clients[client.id] = client;
      clientIndex++;
    }
  });
  
  return clients;
};

// Initialize box states
const initializeBoxes = (clients: Record<string, ClientRecord>): Record<string, { id: string; count: number; clients: ClientRecord[] }> => {
  const boxes: Record<string, { id: string; count: number; clients: ClientRecord[] }> = {};
  const allBoxes = [...initialOfficerBoxes, ...initialUserBoxes];
  
  allBoxes.forEach(box => {
    const boxClients = Object.values(clients).filter(c => c.currentBox === box.id);
    boxes[box.id] = {
      id: box.id,
      count: boxClients.length,
      clients: boxClients,
    };
  });
  
  return boxes;
};

// Initial state
const clients = initializeClients();
const initialState: SystemState = {
  boxes: initializeBoxes(clients),
  clients,
  auditLog: [],
  followUpTasks: [],
  pendingSummary: {
    currentPending: 200000,
    previousPending: 15500,
    todayCollection: {
      count: 3,
      amount: 12500,
    },
    followUpsCompleted: 43,
    followUpsTotal: 45,
  },
  systemHealth: 'healthy',
  demoMode: false,
  lastHealthCheck: new Date(),
};

// Reducer
function systemReducer(state: SystemState, action: SystemAction): SystemState {
  switch (action.type) {
    case 'MOVE_CLIENT': {
      const { clientId, fromBox, toBox, result, remark, userName } = action.payload;
      const client = state.clients[clientId];
      if (!client) return state;

      const newClients = { ...state.clients };
      const newBoxes = { ...state.boxes };

      // Update client
      newClients[clientId] = {
        ...client,
        currentBox: toBox || fromBox,
        lastActionDate: new Date(),
        attemptCount: result === 'done' ? 0 : client.attemptCount + 1,
      };

      // Update from box
      if (newBoxes[fromBox]) {
        newBoxes[fromBox] = {
          ...newBoxes[fromBox],
          count: Math.max(0, newBoxes[fromBox].count - (toBox ? 1 : 0)),
          clients: newBoxes[fromBox].clients.filter(c => c.id !== clientId),
        };
      }

      // Update to box (if different)
      if (toBox && toBox !== fromBox && newBoxes[toBox]) {
        newBoxes[toBox] = {
          ...newBoxes[toBox],
          count: newBoxes[toBox].count + 1,
          clients: [...newBoxes[toBox].clients, newClients[clientId]],
        };
      }

      // Create audit log entry
      const auditEntry: AuditLogEntry = {
        id: generateId(),
        timestamp: new Date(),
        userId: '1',
        userName,
        action: `${result.charAt(0).toUpperCase() + result.slice(1)}`,
        clientId,
        clientName: client.name,
        fromBox,
        toBox: toBox || fromBox,
        remark,
        result,
      };

      return {
        ...state,
        clients: newClients,
        boxes: newBoxes,
        auditLog: [auditEntry, ...state.auditLog].slice(0, 100), // Keep last 100 entries
      };
    }

    case 'UPDATE_BOX_COUNT': {
      const { boxId, delta } = action.payload;
      if (!state.boxes[boxId]) return state;

      return {
        ...state,
        boxes: {
          ...state.boxes,
          [boxId]: {
            ...state.boxes[boxId],
            count: Math.max(0, state.boxes[boxId].count + delta),
          },
        },
      };
    }

    case 'ADD_AUDIT_LOG': {
      return {
        ...state,
        auditLog: [action.payload, ...state.auditLog].slice(0, 100),
      };
    }

    case 'ADD_FOLLOW_UP': {
      return {
        ...state,
        followUpTasks: [action.payload, ...state.followUpTasks],
        pendingSummary: {
          ...state.pendingSummary,
          followUpsTotal: state.pendingSummary.followUpsTotal + 1,
        },
      };
    }

    case 'UPDATE_COLLECTION': {
      return {
        ...state,
        pendingSummary: {
          ...state.pendingSummary,
          todayCollection: {
            count: state.pendingSummary.todayCollection.count + 1,
            amount: state.pendingSummary.todayCollection.amount + action.payload.amount,
          },
          currentPending: Math.max(0, state.pendingSummary.currentPending - action.payload.amount),
        },
      };
    }

    case 'SET_DEMO_MODE': {
      return {
        ...state,
        demoMode: action.payload,
      };
    }

    case 'RUN_HEALTH_CHECK': {
      const totalClientsInBoxes = Object.values(state.boxes).reduce((sum, box) => sum + box.count, 0);
      const totalClients = Object.keys(state.clients).length;
      
      return {
        ...state,
        systemHealth: totalClientsInBoxes <= totalClients ? 'healthy' : 'attention-needed',
        lastHealthCheck: new Date(),
      };
    }

    case 'SET_SYSTEM_HEALTH': {
      return {
        ...state,
        systemHealth: action.payload,
      };
    }

    case 'SIMULATE_ACTION': {
      const { boxId } = action.payload;
      const box = state.boxes[boxId];
      if (!box || box.clients.length === 0) return state;

      const client = getRandomClient(box.clients);
      if (!client) return state;

      const result = getRandomResult();
      const rule = findMovementRule(boxId, result);
      
      // Simulate the action through MOVE_CLIENT
      return systemReducer(state, {
        type: 'MOVE_CLIENT',
        payload: {
          clientId: client.id,
          fromBox: boxId,
          toBox: rule?.toBox || boxId,
          result,
          remark: `Simulated action - ${result}`,
          userName: 'Demo Mode',
        },
      });
    }

    default:
      return state;
  }
}

// Context
interface SystemContextType {
  state: SystemState;
  moveClient: (clientId: string, fromBox: string, result: 'done' | 'follow-up' | 'pending', remark: string) => void;
  simulateAction: (boxId: string) => void;
  toggleDemoMode: () => void;
  runHealthCheck: () => void;
  getClientsInBox: (boxId: string) => ClientRecord[];
  getBoxCount: (boxId: string) => number;
  getRecentActivity: (limit?: number) => AuditLogEntry[];
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

// Provider
export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(systemReducer, initialState);

  const moveClient = useCallback((
    clientId: string,
    fromBox: string,
    result: 'done' | 'follow-up' | 'pending',
    remark: string
  ) => {
    const rule = findMovementRule(fromBox, result);
    const toBox = rule?.toBox || fromBox;
    const client = state.clients[clientId];

    dispatch({
      type: 'MOVE_CLIENT',
      payload: {
        clientId,
        fromBox,
        toBox,
        result,
        remark,
        userName: 'Sandeep Sachdeva',
      },
    });

    // Create follow-up task if needed
    if (rule?.createFollowUp && client) {
      const followUp: FollowUpTask = {
        id: generateId(),
        clientId,
        clientName: client.name,
        taskType: toBox,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        priority: calculatePriority(client.attemptCount),
        assignedOfficer: client.assignedOfficer || 'Unassigned',
        status: 'pending',
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_FOLLOW_UP', payload: followUp });
    }

    // Update collection if payment collected
    if (rule?.updateCollection && client) {
      dispatch({ type: 'UPDATE_COLLECTION', payload: { amount: client.pendingAmount } });
    }
  }, [state.clients]);

  const simulateAction = useCallback((boxId: string) => {
    dispatch({ type: 'SIMULATE_ACTION', payload: { boxId } });
  }, []);

  const toggleDemoMode = useCallback(() => {
    dispatch({ type: 'SET_DEMO_MODE', payload: !state.demoMode });
  }, [state.demoMode]);

  const runHealthCheck = useCallback(() => {
    dispatch({ type: 'RUN_HEALTH_CHECK' });
  }, []);

  const getClientsInBox = useCallback((boxId: string): ClientRecord[] => {
    return state.boxes[boxId]?.clients || [];
  }, [state.boxes]);

  const getBoxCount = useCallback((boxId: string): number => {
    return state.boxes[boxId]?.count || 0;
  }, [state.boxes]);

  const getRecentActivity = useCallback((limit: number = 10): AuditLogEntry[] => {
    return state.auditLog.slice(0, limit);
  }, [state.auditLog]);

  // Run health check periodically
  useEffect(() => {
    const interval = setInterval(() => {
      runHealthCheck();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [runHealthCheck]);

  return (
    <SystemContext.Provider
      value={{
        state,
        moveClient,
        simulateAction,
        toggleDemoMode,
        runHealthCheck,
        getClientsInBox,
        getBoxCount,
        getRecentActivity,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

// Hook
export function useSystem() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}
