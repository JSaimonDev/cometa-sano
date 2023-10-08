"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticles = exports.createArticle = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createArticle = (newArticle) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.article.create({
        data: {
            name: newArticle.name,
            content: newArticle.content,
            categories: {
                connectOrCreate: newArticle.categories.map(name => ({
                    where: { name },
                    create: { name }
                }))
            },
            subcategories: {
                connectOrCreate: newArticle.subcategories.map(subCategory => {
                    return {
                        where: {
                            name: subCategory.name
                        },
                        create: {
                            name: subCategory.name,
                            category: {
                                connectOrCreate: {
                                    where: {
                                        name: subCategory.category
                                    },
                                    create: {
                                        name: subCategory.category
                                    }
                                }
                            }
                        }
                    };
                })
            },
            tags: {
                connectOrCreate: newArticle.tags.map(name => {
                    return {
                        where: { name },
                        create: { name }
                    };
                })
            }
        }
    });
});
exports.createArticle = createArticle;
const getArticles = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
        take: req.pageSize,
        orderBy: {
            createdAt: 'desc'
        }
    };
    if ('cursor' in req && (req.cursor != null)) {
        query = Object.assign(Object.assign({}, query), { skip: 1, cursor: {
                id: req.cursor
            } });
    }
    const articleList = yield prisma.article.findMany(query);
    console.log(articleList);
    const cursor = articleList[req.pageSize - 1].id;
    console.log(cursor);
    return ({
        articleList,
        cursor
    });
});
exports.getArticles = getArticles;
