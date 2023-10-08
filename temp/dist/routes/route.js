"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const routes = (app) => {
    app.get('/api/article', (req, res) => {
        res.send('Sending article');
    });
    app.post('/api/article', (req, res) => {
        res.send('New article saved');
    });
};
exports.routes = routes;
