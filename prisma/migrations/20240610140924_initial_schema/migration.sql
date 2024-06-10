-- CreateTable
CREATE TABLE "book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);
