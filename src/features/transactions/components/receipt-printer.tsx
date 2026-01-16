"use client";

import { Transaction, TransactionItem } from "../types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface ReceiptPrinterProps {
  transaction: Transaction;
  storeName?: string;
  storeAddress?: string;
}

export function ReceiptPrinter({
  transaction,
  storeName = "BUMDES BETOYOKAUMAN",
  storeAddress = "Desa Betoyokauman, Jawa Timur",
}: ReceiptPrinterProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper: Format to exactly 32 chars
  const line32 = (text: string) => {
    return text.substring(0, 32).padEnd(32);
  };

  // Helper: Center text dalam 32 karakter
  const centerText = (text: string) => {
    const trimmed = text.substring(0, 32);
    const padding = Math.max(0, Math.floor((32 - trimmed.length) / 2));
    return " ".repeat(padding) + trimmed;
  };

  // Helper: Split left-right dalam 32 karakter
  const splitLine = (left: string, right: string) => {
    const totalWidth = 32;
    const rightStr = right.substring(0, 15);
    const leftStr = left.substring(0, totalWidth - rightStr.length - 1);
    return leftStr + " ".repeat(totalWidth - leftStr.length - rightStr.length) + rightStr;
  };

  // Format item dengan wrapping
  const formatItem = (item: TransactionItem) => {
    const name = item.product?.name || "Item";
    const qty = item.quantity;
    const price = item.price;
    const subtotal = item.subtotal;

    // Line format: Nama (max 16) Qty x Harga
    const qtyStr = `${qty}x`;
    const priceStr = formatCurrency(price).replace("Rp", "").replace(/\s/g, "").substring(0, 10);
    
    // Nama max 14 karakter
    const nameStr = name.substring(0, 14).padEnd(14);
    
    return {
      line1: `${nameStr} ${qtyStr.padStart(3)} ${priceStr.padStart(10)}`,
      line2: `  Sub: ${formatCurrency(subtotal).padStart(24)}`,
    };
  };

  return (
    <div 
      className="bg-white text-black" 
      style={{ 
        fontFamily: "'Courier New', 'Consolas', monospace",
        fontSize: "11px",
        lineHeight: "1.3",
        width: "58mm",
        padding: "2mm",
        margin: 0,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3mm" }}>
        <div style={{ fontWeight: "bold", fontSize: "12px" }}>
          {centerText(storeName)}
        </div>
        <div style={{ fontSize: "9px", marginTop: "1mm" }}>
          {centerText(storeAddress.substring(0, 32))}
        </div>
      </div>

      {/* Separator */}
      <div style={{ textAlign: "center", margin: "1mm 0" }}>
        ================================
      </div>

      {/* Invoice Info */}
      <div style={{ fontSize: "10px", marginBottom: "2mm" }}>
        <div>{line32(`No: ${transaction.invoice_number}`)}</div>
        <div>
          {line32(
            `Tgl: ${format(new Date(transaction.created_at), "dd/MM/yy HH:mm", { locale: idLocale })}`
          )}
        </div>
        {transaction.user?.name && (
          <div>{line32(`Kasir: ${transaction.user.name.substring(0, 24)}`)}</div>
        )}
      </div>

      {/* Separator */}
      <div style={{ textAlign: "center", margin: "1mm 0" }}>
        ================================
      </div>

      {/* Items Header */}
      <div style={{ fontSize: "9px", fontWeight: "bold", marginBottom: "1mm" }}>
        {line32("ITEM           QTY      HARGA")}
      </div>
      <div style={{ textAlign: "center", margin: "1mm 0" }}>
        --------------------------------
      </div>

      {/* Items */}
      <div style={{ fontSize: "9px", marginBottom: "2mm" }}>
        {transaction.items.map((item: TransactionItem, idx: number) => {
          const lines = formatItem(item);
          return (
            <div key={idx} style={{ marginBottom: "1mm" }}>
              <div>{lines.line1}</div>
              <div style={{ fontSize: "8px", color: "#666" }}>{lines.line2}</div>
            </div>
          );
        })}
      </div>

      {/* Separator */}
      <div style={{ textAlign: "center", margin: "1mm 0" }}>
        ================================
      </div>

      {/* Summary */}
      <div style={{ fontSize: "10px", marginBottom: "2mm" }}>
        <div style={{ fontWeight: "bold" }}>
          {splitLine("TOTAL", formatCurrency(transaction.total_amount))}
        </div>
        <div style={{ marginTop: "1mm" }}>
          {splitLine(
            transaction.payment_method === "cash" ? "TUNAI" : "TRANSFER",
            formatCurrency(transaction.payment_amount)
          )}
        </div>
        {transaction.change_amount > 0 && (
          <div style={{ marginTop: "1mm" }}>
            {splitLine("KEMBALI", formatCurrency(transaction.change_amount))}
          </div>
        )}
      </div>

      {/* Separator */}
      <div style={{ textAlign: "center", margin: "1mm 0" }}>
        ================================
      </div>

      {/* Footer */}
      <div style={{ fontSize: "9px", textAlign: "center", marginTop: "2mm" }}>
        <div style={{ marginBottom: "1mm" }}>
          Terima kasih atas kunjungan Anda
        </div>
        <div style={{ fontSize: "8px", color: "#666" }}>
          {format(new Date(), "dd MMM yyyy HH:mm", { locale: idLocale })}
        </div>
      </div>

      {/* Spacer untuk paper cut */}
      <div style={{ height: "10mm" }}></div>
    </div>
  );
}
