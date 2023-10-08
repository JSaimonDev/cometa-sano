"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const articleController_1 = require("../controllers/articleController");
const routes = (app) => {
    app.get('/api/article', (req, res) => {
        const query = {
            pageSize: Number(req.query.pageSize)
        };
        if (req.query.cursor != null)
            query.cursor = Number(req.query.cursor);
        (0, articleController_1.getArticles)(query)
            .then(articleList => {
            res.send(articleList);
        })
            .catch(e => {
            res.send('Error getting articles from the database');
        });
    });
    app.post('/api/article', (req, res) => {
        (0, articleController_1.createArticle)(req.body)
            .then(createdArticle => {
            res.send(createdArticle);
        })
            .catch(e => {
            res.send('Error saving the article');
        });
    });
};
exports.routes = routes;
