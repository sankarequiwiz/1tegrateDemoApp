import { EventTypes } from './types';

const customREventList = ['event:update_accesskey']

function on(
  eventType: EventTypes,
  listener: EventListenerOrEventListenerObject
) {
  document.addEventListener(eventType, listener);
}

function off(
  eventType: EventTypes,
  listener: EventListenerOrEventListenerObject
) {
  document.removeEventListener(eventType, listener);
}

function trigger<TData>(eventType: EventTypes, data: TData) {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
}

export default { on, off, trigger, customREventList };
