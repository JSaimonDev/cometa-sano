"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = require("./routes/route");
const app = (0, express_1.default)();
const PORT = 3000;
(0, route_1.routes)(app);
app.get('/', (req, res) => {
    res.end('Hello world');
});
app.listen(PORT, () => {
    console.log('Viviendo healthy listening in port 3000');
});
