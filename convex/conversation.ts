import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./_utils";

export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const conversation = await ctx.db.get(args.id);
    if (!conversation) throw new ConvexError("Conversation not found");

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) => q.eq("memberId", currentUser._id).eq("conversationId", conversation._id))
      .unique();
    if (!membership) throw new ConvexError("You aren't a member of this conversation");

    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();
    if (!conversation.isGroup) {
      const otherMemberships = allConversationMemberships.filter((membership) => membership.memberId !== currentUser._id)[0];
      const otherMemberDetails = await ctx.db.get(otherMemberships.memberId);
      return {
        ...conversation,
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessageId: otherMemberships.lastSeenMessage,
        },
        otherMembers: null,
      };
    } else {
      // Group chats
      const otherMemberships = allConversationMemberships.filter((membership) => membership.memberId !== currentUser._id);
      const otherMembers = await Promise.all(
        otherMemberships.map(async (membership) => {
          const member = await ctx.db.get(membership.memberId);
          if (!member) throw new ConvexError("Member could not be found");

          return { _id: member._id, username: member.username };
        }),
      );
      return { ...conversation, otherMembers, otherMember: null };
    }
  },
});

export const createGroup = mutation({
  args: {
    members: v.array(v.id("users")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const conversationId = await ctx.db.insert("conversations", { isGroup: true, name: args.name });

    const members = [...args.members, currentUser._id];

    await Promise.all(
      members.map(async (member) => {
        await ctx.db.insert("conversationMembers", { memberId: member, conversationId: conversationId });
      }),
    );
  },
});

export const deleteGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new ConvexError("Conversation not found");

    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .collect();
    if (!memberships || memberships.length <= 1) throw new ConvexError("This conversation dose not have any members");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    await ctx.db.delete(args.conversationId);

    await Promise.all(
      memberships.map(async (membership) => {
        await ctx.db.delete(membership._id);
      }),
    );
    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id);
      }),
    );
  },
});

export const leaveGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new ConvexError("Conversation not found");

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) => q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId))
      .unique();
    if (!membership) throw new ConvexError("You are not a member of this group");

    await ctx.db.delete(membership._id);
  },
});

export const markRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) => q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId))
      .unique();
    if (!membership) throw new ConvexError("You are not a member of this group");

    const lastMessage = await ctx.db.get(args.messageId);

    await ctx.db.patch(membership._id, { lastSeenMessage: lastMessage ? lastMessage._id : undefined });
  },
});
