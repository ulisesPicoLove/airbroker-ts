"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SidebarInset } from "@/components/ui/sidebar";

const chats = [
  {
    id: "1",
    name: "Juan Pérez",
    phoneNumber: "+34123456789",
    lastMessage: "¿Nos vemos mañana?",
    timestamp: new Date(2023, 5, 1, 14, 30),
    unreadCount: 2,
  },
  {
    id: "2",
    name: "María García",
    phoneNumber: "+34987654321",
    lastMessage: "Gracias por la información",
    timestamp: new Date(2023, 5, 1, 13, 45),
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    phoneNumber: "+34555555555",
    lastMessage: "¿Puedes enviarme el documento?",
    timestamp: new Date(2023, 5, 1, 10, 15),
    unreadCount: 1,
  },
];

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.phoneNumber.includes(searchQuery),
  );

  const handleChatClick = (phoneNumber: string) => {
    router.push(`/inbox/${phoneNumber}`);
  };

  return (
    <SidebarInset className="flex-grow">
      <Card className="flex h-full w-full flex-col">
        <CardHeader className="flex flex-row items-center justify-between bg-muted p-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar chats..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Último mensaje</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>No leídos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChats.map((chat) => (
                <TableRow
                  key={chat.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleChatClick(chat.phoneNumber)}
                >
                  <TableCell className="font-medium">{chat.name}</TableCell>
                  <TableCell>{chat.lastMessage}</TableCell>
                  <TableCell>{chat.timestamp.toLocaleString()}</TableCell>
                  <TableCell>
                    {chat.unreadCount > 0 && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SidebarInset>
  );
}
