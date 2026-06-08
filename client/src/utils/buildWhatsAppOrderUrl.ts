import { WHATSAPP_NUMBER, SITE_NAME } from "../config/siteConfig";
import type { CartItem, CheckoutDetails } from "../types/cart";

export const buildOrderMessage = (
  items: CartItem[],
  details: CheckoutDetails
): string => {
  const lines: string[] = [
    `שלום, אני מעוניין/ת להזמין מהאתר ${SITE_NAME}:`,
    "",
  ];

  items.forEach((item, index) => {
    const skuPart = item.sku ? ` (SKU: ${item.sku})` : "";
    lines.push(`${index + 1}. ${item.name}${skuPart} × ${item.quantity}`);
  });

  lines.push("", "---");
  lines.push(`שם: ${details.customerName}`);
  lines.push(`טלפון: ${details.customerPhone}`);

  if (details.notes?.trim()) {
    lines.push(`הערות: ${details.notes.trim()}`);
  }

  return lines.join("\n");
};

export const buildWhatsAppOrderUrl = (
  items: CartItem[],
  details: CheckoutDetails
): string => {
  const message = buildOrderMessage(items, details);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
