// In-memory local storage mock to resolve Node 22 native localStorage issues in test environment
class LocalStorageMock {
  store: Record<string, string>;
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: any) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(index: number) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new LocalStorageMock(),
  writable: true,
  configurable: true
});

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Clean up DOM after each test
afterEach(() => {
  cleanup();
});
