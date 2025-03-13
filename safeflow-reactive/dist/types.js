"use strict";
/**
 * Core types for the SafeFlow Reactive System
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsolationLevel = exports.TransactionStatus = void 0;
/**
 * Transaction status
 */
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["COMMITTED"] = "COMMITTED";
    TransactionStatus["ROLLED_BACK"] = "ROLLED_BACK";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
/**
 * Transaction isolation level
 */
var IsolationLevel;
(function (IsolationLevel) {
    IsolationLevel["READ_UNCOMMITTED"] = "READ_UNCOMMITTED";
    IsolationLevel["READ_COMMITTED"] = "READ_COMMITTED";
    IsolationLevel["REPEATABLE_READ"] = "REPEATABLE_READ";
    IsolationLevel["SERIALIZABLE"] = "SERIALIZABLE";
})(IsolationLevel || (exports.IsolationLevel = IsolationLevel = {}));
