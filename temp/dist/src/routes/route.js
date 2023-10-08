"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const testController_1 = require("../controllers/testController");
const routes = (app) => {
    app.get('/api/article', (req, res) => {
        res.send('Sending article');
    });
    app.post('/api/article', (req, res) => {
        res.send('heys');
        (0, testController_1.createArticle)(req.body)
            .then(createdArticle => {
            res.send(createdArticle);
        })
            .catch(e => {
            res.send('Error saving the article');
        });
    });
};
exports.routes = routes;
