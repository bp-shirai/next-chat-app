import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const crate = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", args);
  },
});

export const get = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await get(ctx, args);
    if (user === null) {
      console.log("can't delete user, does not exist ", args.clerkId);
    } else {
      await ctx.db.delete(user._id);
    }
  },
});
