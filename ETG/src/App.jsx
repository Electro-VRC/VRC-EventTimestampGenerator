import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const formatOptions = {
  t: { options: { timeStyle: "short" } },
  T: { options: { timeStyle: "medium" } },
  d: { options: { dateStyle: "short" } },
  D: { options: { dateStyle: "long" } },
  f: { options: { dateStyle: "long", timeStyle: "short" } },
  F: {
    options: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  },
  R: { relative: true },
};

export default function DiscordTimestampGenerator() {
  const [datetime, setDatetime] = useState("");
  const [format, setFormat] = useState("F");
  const [name, setName] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const now = new Date();
    const localISOString = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDatetime(localISOString);
  }, []);

  const createTimestamp = () => {
    const unix = Math.floor(new Date(datetime).getTime() / 1000);
    return `<t:${unix}:${format}>`;
  };

  const showToast = (message) => {
    toast(message, { duration: 2000 });
  };

  const generateTimestamp = () => {
    if (!datetime) {
      alert("Please select a date and time.");
      return;
    }
    const result = createTimestamp();
    setHistory((prev) => [...prev, { name: name || "Unnamed", value: result, unix: Math.floor(new Date(datetime).getTime() / 1000) }]);
    setName("");
  };

  const generateAndCopy = async () => {
    generateTimestamp();
    try {
      await navigator.clipboard.writeText(createTimestamp());
      showToast("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copyAllToClipboard = async () => {
    const formatted = history
      .map((item, index) => `${index + 1}. ${item.name} - ${item.value}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(formatted);
      showToast("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy all: ", err);
    }
  };

  const deleteFromHistory = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= history.length) return;
    const updated = [...history];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setHistory(updated);
  };

  const simulateTimestamp = (timestamp) => {
    const match = timestamp.match(/<t:(\d+):([a-zA-Z])>/);
    if (!match) return "Invalid format";
    const unix = parseInt(match[1], 10);
    const fmt = match[2];
    const date = new Date(unix * 1000);

    if (fmt === "R") {
      const now = Date.now();
      const diff = unix * 1000 - now;
      const absDiff = Math.abs(diff);
      const minutes = Math.round(absDiff / 60000);
      if (minutes < 1) return "just now";
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const isFuture = diff > 0;
      if (days > 0) return `${isFuture ? "in" : ""} ${days} day${days > 1 ? "s" : ""}${!isFuture ? " ago" : ""}`;
      if (hours > 0) return `${isFuture ? "in" : ""} ${hours} hour${hours > 1 ? "s" : ""}${!isFuture ? " ago" : ""}`;
      return `${isFuture ? "in" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}${!isFuture ? " ago" : ""}`;
    }

    const options = formatOptions[fmt]?.options || {};
    return date.toLocaleString(undefined, options);
  };

  const parsedDate = datetime ? new Date(datetime) : new Date();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 bg-background text-foreground rounded-2xl shadow-lg border border-border">
      <h1 className="text-4xl font-extrabold text-center tracking-tight">Event Timestamp Generator</h1>
      {/* Your component JSX continues... */}
    </div>
  );
}
