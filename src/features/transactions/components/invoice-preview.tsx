"use client";

import { Transaction } from "../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { forwardRef } from "react";

interface InvoicePreviewProps {
  transaction: Transaction;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ transaction, storeName, storeAddress, storePhone }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };

    return (
      <div
        ref={ref}
        className="bg-white p-8 text-black"
        style={{ width: "80mm", fontFamily: "monospace" }}
      >
        {/* Header */}
        <div className="text-center mb-4 border-b-2 border-dashed border-black pb-4">
          <h1 className="text-xl font-bold">{storeName || "BUMDes POS"}</h1>
          {storeAddress && (
            <p className="text-xs mt-1">{storeAddress}</p>
          )}
          {storePhone && (
            <p className="text-xs">Telp: {storePhone}</p>
          )}
        </div>

        {/* Transaction Info */}
        <div className="text-xs mb-4 space-y-1">
          <div className="flex justify-between">
            <span>Invoice:</span>
            <span className="font-bold">{transaction.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>
              {format(new Date(transaction.created_at), "dd/MM/yyyy HH:mm", {
                locale: localeId,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>{transaction.user?.name || "-"}</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-black my-2" />

        {/* Items */}
        <div className="text-xs mb-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left py-1">Item</th>
                <th className="text-right py-1">Qty</th>
                <th className="text-right py-1">Harga</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map((item) => (
                <tr key={item.id} className="border-b border-dotted border-gray-400">
                  <td className="py-2">
                    <div>{item.product?.name}</div>
                    <div className="text-[10px] text-gray-600">
                      {item.product?.code}
                    </div>
                  </td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="text-right py-2 font-semibold">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t-2 border-dashed border-black my-2" />

        {/* Summary */}
        <div className="text-xs space-y-1 mb-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(transaction.total_amount)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL:</span>
            <span>{formatCurrency(transaction.total_amount)}</span>
          </div>
          <div className="border-t border-black my-2" />
          <div className="flex justify-between">
            <span>Bayar ({transaction.payment_method === "cash" ? "Tunai" : "Transfer"}):</span>
            <span>{formatCurrency(transaction.payment_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kembali:</span>
            <span className="font-bold">
              {formatCurrency(transaction.change_amount)}
            </span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-black my-4" />

        {/* Footer */}
        <div className="text-center text-xs space-y-1">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
          {transaction.notes && (
            <p className="mt-2 text-[10px] italic">Note: {transaction.notes}</p>
          )}
        </div>

        <div className="text-center text-[10px] mt-4 text-gray-600">
          Printed: {format(new Date(), "dd/MM/yyyy HH:mm")}
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";
