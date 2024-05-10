const storageName = 'console-provider-events';

export function setEvent(items: { [key: string]: unknown }) {
   const existing = getEvents() || [];
   window.localStorage.setItem(storageName, JSON.stringify([...existing, items]))
}

export function getEvents() {
   return JSON.parse(window.localStorage.getItem(storageName))
}

export function clearEvents() {
   window.localStorage.clear()
}