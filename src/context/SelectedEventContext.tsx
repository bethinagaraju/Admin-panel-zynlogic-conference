import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SelectedEvent = 'ROBOTICSAISUMMIT' | 'BIO MEDICAL';

interface SelectedEventContextType {
  selectedEvent: SelectedEvent;
  setSelectedEvent: (v: SelectedEvent) => void;
}

const SelectedEventContext = createContext<SelectedEventContextType | undefined>(undefined);

export const SelectedEventProvider = ({ children }: { children: ReactNode }) => {
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>('robotics');

  return (
    <SelectedEventContext.Provider value={{ selectedEvent, setSelectedEvent }}>
      {children}
    </SelectedEventContext.Provider>
  );
};

export const useSelectedEvent = () => {
  const ctx = useContext(SelectedEventContext);
  if (!ctx) {
    throw new Error('useSelectedEvent must be used within SelectedEventProvider');
  }
  return ctx;
};

export default SelectedEventContext;
