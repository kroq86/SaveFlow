"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionManager = getTransactionManager;
exports.setTransactionManager = setTransactionManager;
exports.Transactional = Transactional;
exports.TransactionalClass = TransactionalClass;
const transaction_manager_1 = require("./transaction-manager");
/**
 * Global transaction manager instance
 */
const globalTransactionManager = new transaction_manager_1.TransactionManager();
/**
 * Get the global transaction manager
 * @returns Global transaction manager
 */
function getTransactionManager() {
    return globalTransactionManager;
}
/**
 * Set a custom transaction manager
 * @param manager Custom transaction manager
 */
function setTransactionManager(manager) {
    globalTransactionManager = manager;
}
/**
 * Transactional decorator
 * @param options Transaction options
 * @returns Method decorator
 */
function Transactional(options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return globalTransactionManager.executeTransaction(() => {
                return originalMethod.apply(this, args);
            }, options);
        };
        return descriptor;
    };
}
/**
 * Transactional class decorator
 * @param options Transaction options
 * @returns Class decorator
 */
function TransactionalClass(options = {}) {
    return function (target) {
        // Get all method names from the prototype
        const methodNames = Object.getOwnPropertyNames(target.prototype)
            .filter(name => name !== 'constructor' &&
            typeof target.prototype[name] === 'function');
        // Apply transactional decorator to each method
        methodNames.forEach(methodName => {
            const descriptor = Object.getOwnPropertyDescriptor(target.prototype, methodName);
            if (descriptor && typeof descriptor.value === 'function') {
                Object.defineProperty(target.prototype, methodName, Transactional(options)(target.prototype, methodName, descriptor));
            }
        });
    };
}
