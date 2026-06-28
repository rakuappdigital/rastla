"use client";

interface Props {
  title?: string;
  message?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetConfirm({
  title = "Sıfırlansın mı?",
  message = "Bu sayfadaki tüm veriler silinecek.",
  cancelLabel = "Vazgeç",
  confirmLabel = "Sıfırla",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md animate-slide-up mb-6 mx-4"
        style={{
          background: "rgba(18,18,26,0.98)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20,
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Text block */}
        <div className="px-6 pt-6 pb-5">
          <p className="text-white/90 font-semibold text-base mb-1 tracking-tight">{title}</p>
          <p className="text-white/35 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

        {/* Buttons — stacked, iOS action sheet style */}
        <button
          onClick={onConfirm}
          className="w-full py-4 text-red-400 text-sm font-semibold tracking-wide transition-colors active:bg-white/[0.04]"
        >
          {confirmLabel}
        </button>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

        <button
          onClick={onCancel}
          className="w-full py-4 text-white/40 text-sm tracking-wide transition-colors active:bg-white/[0.04]"
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
