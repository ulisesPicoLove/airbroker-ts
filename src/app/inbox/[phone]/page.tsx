"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset } from "@/components/ui/sidebar";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hola, ¿cómo estás?", sender: "other", timestamp: new Date(2023, 5, 1, 14, 30) },
    {
      id: 2,
      content: "¡Hola! Estoy bien, gracias. ¿Y tú?",
      sender: "user",
      timestamp: new Date(2023, 5, 1, 14, 32),
    },
    {
      id: 3,
      content: "Todo bien por aquí también. ¿Qué planes tienes para hoy?",
      sender: "other",
      timestamp: new Date(2023, 5, 1, 14, 33),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simular respuesta después de 1 segundo
    setTimeout(() => {
      const responseMsg = {
        id: messages.length + 2,
        content: "Gracias por tu mensaje. Te responderé pronto.",
        sender: "other",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, responseMsg]);
    }, 1000);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <SidebarInset className="h-[98%] min-h-0 flex-grow">
      <Card className="flex h-full w-full flex-col">
        <CardHeader className="flex flex-row items-center bg-muted p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Contact" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Contacto</h2>
            <p className="text-sm text-muted-foreground">En línea</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar mensaje</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </SidebarInset>
  );
}
