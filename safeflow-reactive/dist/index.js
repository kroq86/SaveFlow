"use strict";
/**
 * SafeFlow Reactive System
 * A reactive system with transactional guarantees for the SafeFlow framework
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeFlowStore = exports.SafeFlowSubject = exports.setTransactionManager = exports.getTransactionManager = exports.TransactionalClass = exports.Transactional = exports.TransactionManager = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export transaction components
var transaction_manager_1 = require("./transaction/transaction-manager");
Object.defineProperty(exports, "TransactionManager", { enumerable: true, get: function () { return transaction_manager_1.TransactionManager; } });
var transactional_1 = require("./transaction/transactional");
Object.defineProperty(exports, "Transactional", { enumerable: true, get: function () { return transactional_1.Transactional; } });
Object.defineProperty(exports, "TransactionalClass", { enumerable: true, get: function () { return transactional_1.TransactionalClass; } });
Object.defineProperty(exports, "getTransactionManager", { enumerable: true, get: function () { return transactional_1.getTransactionManager; } });
Object.defineProperty(exports, "setTransactionManager", { enumerable: true, get: function () { return transactional_1.setTransactionManager; } });
// Export reactive components
var subject_1 = require("./reactive/subject");
Object.defineProperty(exports, "SafeFlowSubject", { enumerable: true, get: function () { return subject_1.SafeFlowSubject; } });
// Export store components
var transactional_store_1 = require("./store/transactional-store");
Object.defineProperty(exports, "SafeFlowStore", { enumerable: true, get: function () { return transactional_store_1.SafeFlowStore; } });
// Initialize the framework
console.log('SafeFlow Reactive System initialized');
