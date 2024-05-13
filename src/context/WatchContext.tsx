/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { getEvents, setEvent, clearEvents as ClearLclStorage } from '../utils/localstorage';

export type WatchEvents = {
      type: 'EVENT',
      name: string
      payload: { [key: string]: unknown }
}

export type WatchContextValues = {
      events: Array<WatchEvents>
      setEvents: (event: WatchEvents) => void;
      clearEvents: () => void
};

export const WatchContext = React.createContext<WatchContextValues>(null as any);

export const WatchEventsProvider = ({ children, value }: { children?: React.ReactNode, value?: WatchContextValues }) => {
      const [eventState, setEventState] = React.useState(getEvents() || []);

      const setEvents = (event: WatchEvents, clear = false) => {
            if (!clear) {
                  setEventState(prev => [{ isRead: false, ...event }, ...prev])
                  setEvent(event);
            } else {
                  setEventState([])
                  ClearLclStorage();
            }
      }

      const clearEvents = () => setEvents(null, true)

      return (
            <WatchContext.Provider value={{ ...value, setEvents, events: eventState, clearEvents }}>
                  {children}
            </WatchContext.Provider>
      )
}