# Scrape Book

This is just a repo to scrape books from https://books.toscrape.com/ using puppeteer.

## local development setup

```
npm i  //to install dependencies
```

to run the server

```
npm run dev
```

## Endpoint

| Method | URL       | Description                      |
| ------ | --------- | -------------------------------- |
| `GET`  | `/books`  | Retrieve all books stored in DB. |
| `POST` | `/scrape` | To scrape all the books.         |

## Using pages

| Endpoint        | Description                                            |
| --------------- | ------------------------------------------------------ |
| `/books`        | Initial request. Return first 50 books.                |
| `/books?page=2` | Second page, returning 50 books using an offset of 50. |
| `/bokos?page=3` | Third page, returning 50 books using an offset of 100. |
