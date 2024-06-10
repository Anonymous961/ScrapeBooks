import puppeteer from 'puppeteer';

interface Book {
    title: string,
    rating: number,
    price: number,
    currency: string,
    available: boolean
}

async function scrape() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    })

    const page = await browser.newPage();

    let bookData: Book[] = [];

    await page.goto("https://books.toscrape.com/catalogue/page-1.html", { waitUntil: "domcontentloaded" })
    let nextPage = true;
    try {
        while (nextPage) {
            const bookDetails = await page.evaluate(() => {
                const bookList = document.querySelectorAll(".product_pod")
                return Array.from(bookList).map((book) => {
                    const title = (book?.querySelector("h3 > a")?.getAttribute("title") || "") as string;
                    let priceStr = (book?.querySelector(".product_price > .price_color")?.innerHTML || "") as string;
                    const currency = priceStr[0];
                    const price = parseFloat(priceStr.slice(1, priceStr.length))

                    const inStock = (book?.querySelector(".product_price > .instock")?.innerHTML || "").includes("In stock") as boolean;
                    const ratingElement = (book?.querySelector(".star-rating"))
                    let rating = 0;
                    if (ratingElement) {
                        const ratingClass = ratingElement.classList;
                        if (ratingClass.contains("One")) rating = 1;
                        else if (ratingClass.contains("Two")) rating = 2;
                        else if (ratingClass.contains("Three")) rating = 3;
                        else if (ratingClass.contains("Four")) rating = 4;
                        else if (ratingClass.contains("Five")) rating = 5;
                    }
                    return { title, price, currency, available: inStock, rating }
                })
            })
            bookData = bookData.concat(bookDetails)

            const nextButton = await page.$(".pager > .next > a")
            if (nextButton) {
                await nextButton.click();
                await page.waitForNavigation({ waitUntil: "domcontentloaded" })
            } else {
                nextPage = false;
            }
        }
    } catch (error) {
        console.error(error)
    } finally {
        browser.close()
        return bookData;
    }

}
export default scrape;
