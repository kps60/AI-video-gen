// import {  } from "drizzle-orm/mysql-core";
import { pgTable, json, serial, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull(),
    imageUrl: varchar("imageUrl"),
    subscription: boolean("subscription").default(false),
    credits:integer("credits").default(100)
})

export const VideoData = pgTable("VideoData", {
    id: serial("id").primaryKey(),
    script: json("script").notNull(),
    audioFileUrl: varchar("audioFileUrl").notNull(),
    captions: varchar("captions").notNull(),
    imageList: varchar("imageList").array(),
    createdBy: varchar("createdBy").notNull()
})