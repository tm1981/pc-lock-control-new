-- CreateTable
CREATE TABLE "Pc" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "port" INTEGER NOT NULL,

    CONSTRAINT "Pc_pkey" PRIMARY KEY ("id")
);
