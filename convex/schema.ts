import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users
  users: defineTable({
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  // Requests
  requests: defineTable({
    sender: v.id("users"),
    receiver: v.id("users"),
  })
    .index("by_receiver", ["receiver"])
    .index("by_receiver_sender", ["receiver", "sender"]),

  // Friends
  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    conversationId: v.id("conversations"),
  })
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_conversationId", ["conversationId"]),

  // Conversations
  conversations: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages")),
  }),

  // ConversationMembers
  conversationMembers: defineTable({
    memberId: v.id("users"),
    conversationId: v.id("conversations"),
    lastSeenMessage: v.optional(v.id("messages")),
  })
    .index("by_memberId", ["memberId"])
    .index("by_conversationId", ["conversationId"])
    .index("by_memberId_conversationId", ["memberId", "conversationId"]),

  // Messages
  messages: defineTable({
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
  }).index("by_conversationId", ["conversationId"]),
});

/* 
export default defineSchema({
  // Users
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    fullName: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),
  // Chats
  chats: defineTable({
    participantOneId: v.id("users"),
    participantTwoId: v.id("users"),
  })
    .index("by_participantOneId", ["participantOneId", "participantTwoId"])
    .index("by_participantTwoId", ["participantTwoId", "participantOneId"]),
  // Messages
  messages: defineTable({
    chatId: v.id("chats"),
    content: v.string(),
    authorId: v.id("users"),
  }).index("by_chatId", ["chatId"]),
  // User Chats
  userChats: defineTable({
    chatId: v.id("chats"),
    userId: v.id("users"),
  }),
  // Test messages
  demos: defineTable({
    title: v.string(),
    content: v.optional(v.string()),
    userId: v.string(),
  }).index("by_user", ["userId"]),
});
 */
