import React, { createContext, useContext, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { AlertTriangle, Info, HelpCircle } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
}

interface PromptOptions {
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  minLength?: number;
  required?: boolean;
}

interface ModalContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);
  const confirmResolver = useRef<((value: boolean) => void) | null>(null);

  const [promptOpen, setPromptOpen] = useState(false);
  const [promptOptions, setPromptOptions] = useState<PromptOptions | null>(null);
  const [promptValue, setPromptValue] = useState("");
  const [promptError, setPromptError] = useState("");
  const promptResolver = useRef<((value: string | null) => void) | null>(null);

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    setConfirmOptions(options);
    setConfirmOpen(true);
    return new Promise((resolve) => {
      confirmResolver.current = resolve;
    });
  };

  const prompt = (options: PromptOptions): Promise<string | null> => {
    setPromptOptions(options);
    setPromptValue(options.defaultValue || "");
    setPromptError("");
    setPromptOpen(true);
    return new Promise((resolve) => {
      promptResolver.current = resolve;
    });
  };

  const handleConfirmClose = (value: boolean) => {
    setConfirmOpen(false);
    if (confirmResolver.current) {
      confirmResolver.current(value);
      confirmResolver.current = null;
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minLength = promptOptions?.minLength ?? 0;
    const required = promptOptions?.required ?? false;

    if (required && promptValue.trim() === "") {
      setPromptError("This field is required.");
      return;
    }

    if (promptValue.trim().length < minLength) {
      setPromptError(`Please enter at least ${minLength} characters.`);
      return;
    }

    setPromptOpen(false);
    if (promptResolver.current) {
      promptResolver.current(promptValue);
      promptResolver.current = null;
    }
  };

  const handlePromptCancel = () => {
    setPromptOpen(false);
    if (promptResolver.current) {
      promptResolver.current(null);
      promptResolver.current = null;
    }
  };

  return (
    <ModalContext.Provider value={{ confirm, prompt }}>
      {children}

      <Dialog open={confirmOpen} onOpenChange={(open) => !open && handleConfirmClose(false)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border-0 shadow-xl">
          <DialogHeader className="flex flex-row items-center gap-4 text-left">
            <div className={`p-3 rounded-2xl shrink-0 ${
              confirmOptions?.variant === "danger"
                ? "bg-red-50 text-red-600"
                : confirmOptions?.variant === "warning"
                ? "bg-amber-50 text-amber-500"
                : "bg-blue-50 text-blue-600"
            }`}>
              {confirmOptions?.variant === "danger" ? (
                <AlertTriangle size={24} />
              ) : confirmOptions?.variant === "warning" ? (
                <AlertTriangle size={24} />
              ) : (
                <HelpCircle size={24} />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
                {confirmOptions?.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-semibold mt-1">
                {confirmOptions?.message}
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-4 flex sm:flex-row gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => handleConfirmClose(false)}
              className="rounded-xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 cursor-pointer h-10 text-xs px-4"
            >
              {confirmOptions?.cancelText || "Cancel"}
            </Button>
            <Button
              onClick={() => handleConfirmClose(true)}
              className={`rounded-xl font-bold cursor-pointer h-10 text-xs px-4 text-white ${
                confirmOptions?.variant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : confirmOptions?.variant === "warning"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmOptions?.confirmText || "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={promptOpen} onOpenChange={(open) => !open && handlePromptCancel()}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border-0 shadow-xl">
          <DialogHeader className="flex flex-row items-center gap-4 text-left">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
              <Info size={24} />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
                {promptOptions?.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-semibold mt-1">
                {promptOptions?.message}
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handlePromptSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Input
                value={promptValue}
                onChange={(e) => {
                  setPromptValue(e.target.value);
                  setPromptError("");
                }}
                placeholder={promptOptions?.placeholder || "Enter details..."}
                className="h-10 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-semibold"
                autoFocus
              />
              {promptError && (
                <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                  <span>{promptError}</span>
                </p>
              )}
            </div>

            <DialogFooter className="flex sm:flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handlePromptCancel}
                className="rounded-xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 cursor-pointer h-10 text-xs px-4"
              >
                {promptOptions?.cancelText || "Cancel"}
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer h-10 text-xs px-4"
              >
                {promptOptions?.confirmText || "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
