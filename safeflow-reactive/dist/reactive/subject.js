"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeFlowSubject = void 0;
/**
 * Subscription implementation
 */
class SafeFlowSubscription {
    constructor(onUnsubscribe) {
        this._closed = false;
        this.onUnsubscribe = onUnsubscribe;
    }
    /**
     * Unsubscribe from the observable
     */
    unsubscribe() {
        if (!this._closed) {
            this.onUnsubscribe();
            this._closed = true;
        }
    }
    /**
     * Whether the subscription is closed
     */
    get closed() {
        return this._closed;
    }
}
/**
 * SafeFlow Subject implementation
 */
class SafeFlowSubject {
    constructor() {
        this.observers = [];
        this._isClosed = false;
        this._hasValue = false;
    }
    /**
     * Subscribe to the subject
     * @param observerOrNext Observer or next function
     * @param error Error function
     * @param complete Complete function
     * @returns Subscription
     */
    subscribe(observerOrNext, error, complete) {
        let observer;
        if (typeof observerOrNext === 'function') {
            // Create observer from functions
            observer = {
                next: observerOrNext,
                error: error || (() => { }),
                complete: complete || (() => { })
            };
        }
        else if (observerOrNext) {
            // Use provided observer
            observer = observerOrNext;
        }
        else {
            // Create empty observer
            observer = {
                next: () => { },
                error: () => { },
                complete: () => { }
            };
        }
        // Add observer to the list
        this.observers.push(observer);
        // If we have a value, emit it immediately
        if (this._hasValue && this.lastValue !== undefined) {
            observer.next(this.lastValue);
        }
        // If already closed, call complete
        if (this._isClosed) {
            observer.complete();
        }
        // Create subscription
        return new SafeFlowSubscription(() => {
            const index = this.observers.indexOf(observer);
            if (index !== -1) {
                this.observers.splice(index, 1);
            }
        });
    }
    /**
     * Emit a new value
     * @param value Value to emit
     */
    next(value) {
        if (this._isClosed) {
            return;
        }
        this.lastValue = value;
        this._hasValue = true;
        // Notify all observers
        for (const observer of this.observers) {
            try {
                observer.next(value);
            }
            catch (err) {
                console.error('Error in observer.next:', err);
            }
        }
    }
    /**
     * Emit an error
     * @param err Error to emit
     */
    error(err) {
        if (this._isClosed) {
            return;
        }
        this._isClosed = true;
        // Notify all observers
        for (const observer of this.observers) {
            try {
                observer.error(err);
            }
            catch (err) {
                console.error('Error in observer.error:', err);
            }
        }
        // Clear observers
        this.observers = [];
    }
    /**
     * Complete the observable
     */
    complete() {
        if (this._isClosed) {
            return;
        }
        this._isClosed = true;
        // Notify all observers
        for (const observer of this.observers) {
            try {
                observer.complete();
            }
            catch (err) {
                console.error('Error in observer.complete:', err);
            }
        }
        // Clear observers
        this.observers = [];
    }
    /**
     * Get the current value
     * @returns Current value
     */
    getValue() {
        return this.lastValue;
    }
    /**
     * Check if the subject has a value
     * @returns Whether the subject has a value
     */
    hasValue() {
        return this._hasValue;
    }
    /**
     * Check if the subject is closed
     * @returns Whether the subject is closed
     */
    isClosed() {
        return this._isClosed;
    }
    /**
     * Get the number of observers
     * @returns Number of observers
     */
    getObserverCount() {
        return this.observers.length;
    }
}
exports.SafeFlowSubject = SafeFlowSubject;
