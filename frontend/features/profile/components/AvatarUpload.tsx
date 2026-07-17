import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, X, Camera, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvatarUploadProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (avatarBase64?: string) => Promise<void>;
  isSaving?: boolean;
}

export function AvatarUpload({
  isOpen,
  onClose,
  currentAvatar,
  onSave,
  isSaving = false,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Format validation
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Invalid format. Please select a JPG or PNG image.");
      return;
    }

    // Size validation (Max 2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Maximum size allowed is 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveClick = async () => {
    try {
      await onSave(preview || undefined);
      toast.success("Avatar image updated successfully!");
      onClose();
    } catch {
      toast.error("Failed to save avatar image.");
    }
  };

  const handleClose = () => {
    setPreview(currentAvatar || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-border bg-[#0f172a] text-white sm:max-w-md select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Camera className="size-5 text-primary" />
            Upload Profile Photo
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Select a JPG or PNG image. Maximum size 2 MB.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Avatar Preview container */}
          <div className="relative size-32 rounded-full border-2 border-border overflow-hidden bg-muted/20 flex items-center justify-center shadow-inner">
            {preview ? (
              <img src={preview} alt="Preview" className="size-full object-cover" />
            ) : (
              <Upload className="size-8 text-[#64748b]" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              className="h-8 text-xs font-semibold gap-1 border-border hover:bg-muted"
            >
              <Upload className="size-3.5" />
              <span>Select File</span>
            </Button>
            {preview && (
              <Button
                type="button"
                onClick={handleRemove}
                className="h-8 text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:text-white font-bold gap-1"
              >
                <Trash2 className="size-3.5" />
                <span>Remove</span>
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={handleClose} className="border-border">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
            className="gap-1.5 font-bold"
          >
            {isSaving && <RefreshCw className="size-4 animate-spin" />}
            Save Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AvatarUpload;
