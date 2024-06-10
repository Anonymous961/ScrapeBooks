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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scrapeBooks_1 = __importDefault(require("./utils/scrapeBooks"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
app.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const totalRoles = yield prisma.book.count();
        const totalPages = Math.ceil(totalRoles / limit);
        const books = yield prisma.book.findMany({
            skip
        });
        res.json({
            "content": {
                "meta": {
                    "total": totalRoles,
                    "pages": totalPages,
                    "page": page
                },
                "data": books
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ error: error.message });
    }
}));
app.post("/scrape", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield (0, scrapeBooks_1.default)();
        console.log(books);
        const response = yield prisma.book.createMany({
            data: books,
            skipDuplicates: true,
        });
        console.log(response);
        res.json(response);
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ error: error.message });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running no port ${PORT}`);
});
