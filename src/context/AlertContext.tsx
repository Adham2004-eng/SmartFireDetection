import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Alert, AlertType, RiskLevel } from '../types';
import { mockAlerts, generateMockAlert } from '../mockData/mockAlerts';

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;
  getUnacknowledgedAlerts: () => Alert[];
  hasFireAlert: () => boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  // Simulate new alerts periodically (demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate alerts (10% chance every 5 seconds)
      if (Math.random() < 0.1) {
        const newAlert = generateMockAlert();
        setAlerts((prev) => [newAlert, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addAlert = (alert: Alert) => {
    setAlerts((prev) => [alert, ...prev]);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const getUnacknowledgedAlerts = () => {
    return alerts.filter((alert) => !alert.acknowledged);
  };

  const hasFireAlert = () => {
    return alerts.some(
      (alert) => alert.type === 'fire' && !alert.acknowledged
    );
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        acknowledgeAlert,
        getUnacknowledgedAlerts,
        hasFireAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

