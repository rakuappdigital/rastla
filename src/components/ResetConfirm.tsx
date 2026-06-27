"use client";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetConfirm({ onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-[#16162a] border border-white/10 rounded-3xl p-6 animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl mb-3">🗑️</div>
        <h3 className="font-bold text-lg mb-1">Sıfırlansın mı?</h3>
        <p className="text-white/40 text-sm mb-6">Bu sayfadaki tüm veriler silinecek.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-sm text-white/60 font-semibold active:scale-95 transition-all"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-bold active:scale-95 transition-all"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}
