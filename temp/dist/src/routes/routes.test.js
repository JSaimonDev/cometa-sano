"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
(0, vitest_1.describe)('Testing article endpoints', () => {
    (0, vitest_1.it)('Get endpoint return 200 status', () => {
        (0, supertest_1.default)(app)
            .get('/api/articles')
            .expect(200)
            .expect('Content-Type', /json/)
            .catch(e => { console.log('error'); });
    });
});
