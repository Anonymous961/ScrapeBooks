import scrape from "./utils/scrapeBooks";
import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";
dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

app.get("/books", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;
        const totalRoles = await prisma.book.count();
        const totalPages = Math.ceil(totalRoles / limit);

        const books = await prisma.book.findMany({
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
        })
    } catch (error: any) {
        console.log(error)
        res.status(403).json({ error: error.message })
    }
})

app.post("/scrape", async (req, res) => {

    try {
        const books = await scrape();
        console.log(books);
        const response = await prisma.book.createMany({
            data: books,
            skipDuplicates: true,
        })
        console.log(response)
        res.json(response)
    } catch (error: any) {
        console.log(error)
        res.status(403).json({ error: error.message })
    }
})


app.listen(PORT, () => {
    console.log(`Server is running no port ${PORT}`)
})