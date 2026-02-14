"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";

interface ReturnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    order: any | null;
    type: 'return' | 'cancel';
}

const REASONS = {
    cancel: [
        "Changed my mind",
        "Found a better price",
        "Ordered by mistake",
        "Delivery time is too long",
        "Other"
    ],
    return: [
        "Wrong size / Does not fit",
        "Item is damaged / defective",
        "Received wrong item",
        "Quality not as expected",
        "Other"
    ]
};

export default function ReturnModal({ isOpen, onClose, onSubmit, type, order }: ReturnModalProps) {
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const handleSubmit = () => {
        const reason = selectedReason === "Other" ? customReason : selectedReason;
        if (reason) onSubmit(reason);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
                    >
                        <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md pointer-events-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold">
                                    {type === 'cancel' ? 'Cancel Order' : 'Request Return'}
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto">
                                {/* Order Summary */}
                                {order && (
                                    <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Items to {type === 'cancel' ? 'Cancel' : 'Return'}</h3>
                                        {order.orderDetails?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-3 items-center">
                                                <div className="w-10 h-10 bg-white/5 rounded flex-shrink-0 overflow-hidden border border-white/10 flex items-center justify-center">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-4 h-4 bg-white/20 rounded-sm" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 text-yellow-500 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>
                                        {type === 'cancel'
                                            ? "Are you sure? Refunds for paid orders are processed to your wallet instantly."
                                            : "Please ensure the item is unused and in original packaging."}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-400">Select Reason</label>
                                    <div className="space-y-2">
                                        {REASONS[type].map((reason) => (
                                            <label
                                                key={reason}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedReason === reason
                                                    ? "border-primary bg-primary/10 text-white"
                                                    : "border-white/10 hover:border-white/30 text-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={reason}
                                                    checked={selectedReason === reason}
                                                    onChange={(e) => setSelectedReason(e.target.value)}
                                                    className="w-4 h-4 text-primary bg-transparent border-gray-600 focus:ring-primary"
                                                />
                                                <span className="text-sm">{reason}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {selectedReason === "Other" && (
                                    <div>
                                        <textarea
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                            placeholder="Please describe why..."
                                            className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none transition-colors resize-none"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-white/5">
                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={onClose}>
                                        Keep Order
                                    </Button>
                                    <Button
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none"
                                        disabled={!selectedReason || (selectedReason === "Other" && !customReason.trim())}
                                        onClick={handleSubmit}
                                    >
                                        {type === 'cancel' ? 'Confirm Cancellation' : 'Submit Request'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
