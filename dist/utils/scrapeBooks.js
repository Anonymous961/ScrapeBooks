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
const puppeteer_1 = __importDefault(require("puppeteer"));
function scrape() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            headless: false,
            defaultViewport: null
        });
        const page = yield browser.newPage();
        let bookData = [];
        yield page.goto("https://books.toscrape.com/catalogue/page-1.html", { waitUntil: "domcontentloaded" });
        let nextPage = true;
        try {
            while (nextPage) {
                const bookDetails = yield page.evaluate(() => {
                    const bookList = document.querySelectorAll(".product_pod");
                    return Array.from(bookList).map((book) => {
                        var _a, _b, _c;
                        const title = (((_a = book === null || book === void 0 ? void 0 : book.querySelector("h3 > a")) === null || _a === void 0 ? void 0 : _a.getAttribute("title")) || "");
                        let priceStr = (((_b = book === null || book === void 0 ? void 0 : book.querySelector(".product_price > .price_color")) === null || _b === void 0 ? void 0 : _b.innerHTML) || "");
                        const currency = priceStr[0];
                        const price = parseFloat(priceStr.slice(1, priceStr.length));
                        const inStock = (((_c = book === null || book === void 0 ? void 0 : book.querySelector(".product_price > .instock")) === null || _c === void 0 ? void 0 : _c.innerHTML) || "").includes("In stock");
                        const ratingElement = (book === null || book === void 0 ? void 0 : book.querySelector(".star-rating"));
                        let rating = 0;
                        if (ratingElement) {
                            const ratingClass = ratingElement.classList;
                            if (ratingClass.contains("One"))
                                rating = 1;
                            else if (ratingClass.contains("Two"))
                                rating = 2;
                            else if (ratingClass.contains("Three"))
                                rating = 3;
                            else if (ratingClass.contains("Four"))
                                rating = 4;
                            else if (ratingClass.contains("Five"))
                                rating = 5;
                        }
                        return { title, price, currency, available: inStock, rating };
                    });
                });
                bookData = bookData.concat(bookDetails);
                const nextButton = yield page.$(".pager > .next > a");
                if (nextButton) {
                    yield nextButton.click();
                    yield page.waitForNavigation({ waitUntil: "domcontentloaded" });
                }
                else {
                    nextPage = false;
                }
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            browser.close();
            return bookData;
        }
    });
}
exports.default = scrape;
