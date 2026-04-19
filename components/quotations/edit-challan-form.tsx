"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface EditChallanFormProps {
  quotationId: string;
  currentChallanNumber?: string;
  currentChallanAmount?: number;
  onUpdate: (id: string, data: any) => Promise<void>;
}

export function EditChallanForm({ 
  quotationId, 
  currentChallanNumber = "", 
  currentChallanAmount = 0,
  onUpdate 
}: EditChallanFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [challanNumber, setChallanNumber] = useState(currentChallanNumber);
  const [challanAmount, setChallanAmount] = useState(currentChallanAmount);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(quotationId, { 
        challanNumber, 
        challanAmount: Number(challanAmount) 
      });
      toast.success("Challan updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update challan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setChallanNumber(currentChallanNumber);
    setChallanAmount(currentChallanAmount);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={challanNumber}
            onChange={(e) => setChallanNumber(e.target.value)}
            placeholder="Challan #"
            className="text-xs border border-slate-200 rounded px-2 py-1 w-28 outline-none focus:border-brand-500"
          />
          <input
            type="number"
            value={challanAmount}
            onChange={(e) => setChallanAmount(Number(e.target.value))}
            placeholder="Amount"
            className="text-xs border border-slate-200 rounded px-2 py-1 w-28 outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200"
      title="Edit Challan"
    >
      <Pencil className="w-4 h-4" />
      <span>Edit Challan</span>
    </button>
  );
}
