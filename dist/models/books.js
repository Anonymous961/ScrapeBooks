"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const bookSchema = new Schema({
    name: String,
    price: Number,
    currency: String,
    available: Boolean,
    rating: Number
}, { timestamps: true });
const BookSchema = mongoose_1.default.model("Book", bookSchema);
exports.BookSchema = BookSchema;
