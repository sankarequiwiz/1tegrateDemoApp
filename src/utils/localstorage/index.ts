/* eslint-disable @typescript-eslint/no-explicit-any */
const storageName = 'console-provider-events';

export function setEvent(items: { [key: string]: unknown }) {
   const existing: Array<any> = getEvents() || [];
   existing.unshift(items);
   window.localStorage.setItem(storageName, JSON.stringify(existing))
}

export function getEvents() {
   return JSON.parse(window.localStorage.getItem(storageName))
}

export function clearEvents() {
   window.localStorage.clear()
}