import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByStory = query({
  args: { storyId: v.id("stories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify user owns this story
    const story = await ctx.db.get(args.storyId);
    if (!story || story.userId !== userId) return [];

    return await ctx.db
      .query("messages")
      .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    storyId: v.id("stories"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this story
    const story = await ctx.db.get(args.storyId);
    if (!story || story.userId !== userId) throw new Error("Not found");

    // Update story timestamp
    await ctx.db.patch(args.storyId, { updatedAt: Date.now() });

    return await ctx.db.insert("messages", {
      storyId: args.storyId,
      userId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});
