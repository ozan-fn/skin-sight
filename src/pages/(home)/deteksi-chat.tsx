// // src/pages/ChatPage.tsx
// import { useLocation } from "react-router";

// export default function ChatPage() {
//   const location = useLocation();
//   // Tangkap data yang dikirim dari halaman Deteksi
//   const item = location.state?.data;

//   if (!item) return <div>Belum ada percakapan.</div>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <h2 className="text-2xl font-bold border-b pb-2">Analisis Kulit</h2>

//       {/* Bubble Chat User */}
//       <div className="flex flex-col items-end gap-2">
//         <div className="bg-orange-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%]">
//           <p className="mb-3">{item.teks}</p>
//           <div className="flex gap-2 flex-wrap">
//             {item.gambar.map((src: string, i: number) => (
//               <img
//                 key={i}
//                 src={src}
//                 className="w-24 h-24 object-cover rounded-lg border border-white/20"
//               />
//             ))}
//           </div>
//           <span className="text-[10px] opacity-70 mt-2 block">
//             {item.waktu}
//           </span>
//         </div>
//       </div>

//       {/* Bubble Chat AI (Dummy) */}
//       <div className="flex flex-col items-start gap-2">
//         <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] border">
//           <p className="font-semibold text-orange-600 mb-1">SkinSight AI</p>
//           <p>{item.balasanAI}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChatMessage,
  type Message,
  type ImageAttachment,
} from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { Sparkles } from "lucide-react";
import { useLocation } from "react-router";

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Welcome to Analysis Assistant. I can help you explore your data, identify trends, generate insights, and analyze images you share with me. What would you like to work on today?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    role: "user",
    content: "Show me the revenue breakdown by region for Q4.",
    timestamp: "10:31 AM",
  },
  {
    id: "3",
    role: "ai",
    content:
      "Based on the Q4 data, here is the regional breakdown:\n\n- North America: $142,800 (48.2%)\n- Europe: $89,400 (30.2%)\n- Asia-Pacific: $41,200 (13.9%)\n- Other: $22,600 (7.7%)\n\nNorth America saw the strongest growth at +15.3% QoQ, while Asia-Pacific shows the highest growth potential with a +22.1% increase.",
    timestamp: "10:31 AM",
  },
  {
    id: "4",
    role: "user",
    content: "What endpoints are causing the highest error rates?",
    timestamp: "10:33 AM",
  },
  {
    id: "5",
    role: "ai",
    content:
      "I found 2 endpoints with elevated error rates:\n\n1. /api/v2/billing (6.2%) - Timeout errors from payment processor. Recommend implementing retry logic with exponential backoff.\n\n2. /api/v2/orders (4.8%) - Intermittent 500 errors. Root cause appears to be database connection pool exhaustion during peak hours (14:00-17:00 UTC).\n\nBoth are flagged as Critical in the monitoring dashboard. Would you like me to draft a remediation plan?",
    timestamp: "10:33 AM",
  },
];

const aiResponses = [
  "I've analyzed the data you provided. Here are the key findings:\n\n- Overall performance is trending upward with a 12% improvement over the previous period\n- The primary driver appears to be increased engagement in the 25-34 age demographic\n- Conversion rates have stabilized around 3.8%, which is above industry average\n\nWould you like me to generate a detailed breakdown or export this as a report?",
  "Looking at the patterns in your data, I can identify several actionable insights:\n\n1. Peak traffic occurs between 09:00-11:00 UTC and 14:00-16:00 UTC\n2. Mobile users have a 23% higher bounce rate compared to desktop\n3. The /checkout flow has a 15% drop-off at the payment step\n\nI recommend A/B testing a simplified payment form to reduce friction.",
  "Based on my analysis of the uploaded data:\n\n- The correlation between marketing spend and conversions is strongest in the paid search channel (r=0.87)\n- Email campaigns show diminishing returns after the 3rd touchpoint\n- Social media engagement has increased 34% but conversion attribution remains unclear\n\nShall I create visualizations for these findings?",
];

export default function ChatPage() {
  const location = useLocation();
  // Tangkap data yang dikirim dari halaman Deteksi
  const item = location.state?.data;

  if (!item) return <div>Belum ada percakapan.</div>;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pendingImages, setPendingImages] = useState<ImageAttachment[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // Add initial user message from file upload
  useEffect(() => {
    if (item && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      // Convert images from file upload to ImageAttachment format
      const images: ImageAttachment[] = (item.gambar || []).map(
        (img: any, index: number) => ({
          id: `uploaded-${Date.now()}-${index}`,
          url: img.preview || img.url || img,
          name: img.file?.name || `image-${index + 1}.jpg`,
        }),
      );

      // Only create message if there's text or images
      if (item.teks || images.length > 0) {
        const userMsg: Message = {
          id: `user-initial-${Date.now()}`,
          role: "user",
          content: item.teks || "",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          images: images.length > 0 ? images : undefined,
        };

        setMessages([userMsg]);
        setIsTyping(true);

        // Simulated AI response
        setTimeout(() => {
          const responseText =
            "I've received your image(s) and description. Let me analyze them for you. Based on the visual patterns, I can provide some initial observations about your skin condition. However, please note that this is not a medical diagnosis. Would you like me to provide more detailed analysis?";

          const aiMsg: Message = {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: responseText,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
        }, 1500);
      }
    }
  }, [item]);

  const scrollToBottom = useCallback(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleAddImages = useCallback((images: ImageAttachment[]) => {
    setPendingImages((prev) => [...prev, ...images]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setPendingImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() && pendingImages.length === 0) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: timeStr,
      images: pendingImages.length > 0 ? [...pendingImages] : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingImages([]);
    setIsTyping(true);

    // Simulated AI response
    const delay = 1200 + Math.random() * 1000;
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * aiResponses.length);
      let responseText = aiResponses[responseIndex];

      if (userMsg.images && userMsg.images.length > 0) {
        const imageCount = userMsg.images.length;
        responseText =
          `I've received ${imageCount} image${imageCount > 1 ? "s" : ""} and analyzed ${imageCount > 1 ? "them" : "it"}. Here are my observations:\n\n` +
          "- The image contains structured data that aligns with your current dataset\n" +
          "- I detected several data points that could be extracted for further analysis\n" +
          "- The visual patterns suggest a correlation with the trends we discussed earlier\n\n" +
          "Would you like me to run a deeper analysis on the image content, or should I extract the data into a table format?";
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: responseText,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  }, [input, pendingImages]);

  return (
    <div className="flex min-h-screen p-20 flex-1 flex-col">
      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-6">
          {/* Welcome banner - only show if no initial messages from file upload */}
          {messages.length <= 1 && (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="size-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Analysis Assistant
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Ask questions about your data, upload images for analysis, or
                request insights and reports.
              </p>
            </div>
          )}

          {/* Messages list */}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={scrollEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        pendingImages={pendingImages}
        onAddImages={handleAddImages}
        onRemoveImage={handleRemoveImage}
        isTyping={isTyping}
      />
    </div>
    // </div>
  );
}
