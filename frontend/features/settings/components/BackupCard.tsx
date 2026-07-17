import React, { useRef } from "react";
import { Download, Upload, RotateCcw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BackupCardProps {
  onExport: () => void;
  onImport: (fileContent: string) => Promise<any>;
  onReset: () => Promise<any>;
  isResetting?: boolean;
  isImporting?: boolean;
}

export function BackupCard({
  onExport,
  onImport,
  onReset,
  isResetting = false,
  isImporting = false,
}: BackupCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        await onImport(content);
        toast.success("Settings imported successfully!");
      } catch (err: any) {
        toast.error(err.message || "Failed to import settings file.");
      }
    };

    reader.readAsText(file);
    // Reset file input value so same file can be reselected
    e.target.value = "";
  };

  const handleResetClick = async () => {
    if (confirm("Are you sure you want to reset all preferences to their default states? This cannot be undone.")) {
      try {
        await onReset();
        toast.success("Settings restored to system defaults.");
      } catch (err: any) {
        toast.error("Failed to reset settings.");
      }
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-lg select-none space-y-4">
      <div className="flex items-center gap-2 border-b border-border/55 pb-3">
        <Database className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-white">Preference Backup & Restoration</h3>
          <p className="text-[11px] text-[#94a3b8]">Export setting profiles, import overrides, or reset parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Export Settings */}
        <Button
          type="button"
          onClick={onExport}
          className="h-10 text-xs font-bold gap-1.5 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 hover:bg-[#3b82f6]/15 hover:text-white transition"
        >
          <Download className="size-4" />
          Export Settings
        </Button>

        {/* Import Settings */}
        <div className="relative">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            onClick={handleImportClick}
            disabled={isImporting}
            className="h-10 w-full text-xs font-bold gap-1.5 bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20 hover:bg-[#14b8a6]/15 hover:text-white transition"
          >
            <Upload className="size-4" />
            {isImporting ? "Importing..." : "Import Settings"}
          </Button>
        </div>

        {/* Reset Settings */}
        <Button
          type="button"
          onClick={handleResetClick}
          disabled={isResetting}
          className="h-10 text-xs font-bold gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:text-white transition"
        >
          <RotateCcw className="size-4" />
          {isResetting ? "Resetting..." : "Reset to Default"}
        </Button>
      </div>
    </section>
  );
}

export default BackupCard;
