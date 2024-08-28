import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./_utils";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) => q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId))
      .unique();
    if (!membership) throw new ConvexError("You aren't a member of this conversation");

    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      ...args,
    });

    // 最後のメッセージIDを更新します
    await ctx.db.patch(args.conversationId, { lastMessageId: message });

    return message;
  },
});
