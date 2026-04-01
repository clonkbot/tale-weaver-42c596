import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Stories - each story is a conversation thread
  stories: defineTable({
    userId: v.id("users"),
    title: v.string(),
    genre: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Messages within stories
  messages: defineTable({
    storyId: v.id("stories"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_story", ["storyId"])
    .index("by_user", ["userId"]),
});
