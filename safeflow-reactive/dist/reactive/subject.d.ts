/**
 * Reactive Subject implementation for the SafeFlow Reactive System
 */
import { Subject, Observer, Subscription } from '../types';
/**
 * SafeFlow Subject implementation
 */
export declare class SafeFlowSubject<T> implements Subject<T> {
    private observers;
    private _isClosed;
    private lastValue;
    private _hasValue;
    /**
     * Subscribe to the subject
     * @param observerOrNext Observer or next function
     * @param error Error function
     * @param complete Complete function
     * @returns Subscription
     */
    subscribe(observerOrNext?: Observer<T> | ((value: T) => void), error?: (error: any) => void, complete?: () => void): Subscription;
    /**
     * Emit a new value
     * @param value Value to emit
     */
    next(value: T): void;
    /**
     * Emit an error
     * @param err Error to emit
     */
    error(err: any): void;
    /**
     * Complete the observable
     */
    complete(): void;
    /**
     * Get the current value
     * @returns Current value
     */
    getValue(): T | undefined;
    /**
     * Check if the subject has a value
     * @returns Whether the subject has a value
     */
    hasValue(): boolean;
    /**
     * Check if the subject is closed
     * @returns Whether the subject is closed
     */
    isClosed(): boolean;
    /**
     * Get the number of observers
     * @returns Number of observers
     */
    getObserverCount(): number;
}
