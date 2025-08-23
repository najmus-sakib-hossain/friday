"use client"

import * as React from "react"
import { MessageList } from "@/components/chat/messages/message-list"
import { ChatComposer } from "@/components/chat/composer/chat-composer"
import { HelloGlow } from "@/components/common/hello-glow";

export default function ChatPage() {
  return (
    <div className="relative flex min-h-full w-full flex-col transition-all duration-200 ease-linear">
      <MessageList />
      <ChatComposer />
      {/* <HelloGlow /> */}
    </div>
  );
}
