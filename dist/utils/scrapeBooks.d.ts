interface Book {
    title: string;
    rating: number;
    price: number;
    currency: string;
    available: boolean;
}
declare function scrape(): Promise<Book[]>;
export default scrape;
