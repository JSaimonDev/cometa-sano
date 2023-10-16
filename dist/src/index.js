"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/post/routes"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ limit: '5mb', extended: true }));
app.use((0, cors_1.default)());
app.use('/api/post', routes_1.default);
app.listen(config_1.default.PORT, () => {
    console.log(`Sano sanote listening in port ${config_1.default.PORT}`);
});
