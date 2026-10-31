import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import {
  Building2,
  KeyRound,
  Laptop,
  Ticket,
  Store,
  Bike,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  Copy,
  Check,
  Upload
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function CompanySettingsView() {
  const { settings, updateSettings, showToast } = usePos();

  const [copied, setCopied] = useState(false);
  const [queueNumbers, setQueueNumbers] = useState(settings.queue_numbers || false);
  const [takeaway, setTakeaway] = useState(settings.order_type_takeaway !== false);
  const [goFood, setGoFood] = useState(settings.delivery_gofood || false);
  const [grabFood, setGrabFood] = useState(settings.delivery_grabfood || false);
  const [shopeeFood, setShopeeFood] = useState(settings.delivery_shopeefood || false);

  const businessCode = settings.business_code || 'e14d33a6-e2a7-4f8c-8ce6-63a7e1f6c6d7';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(businessCode);
    setCopied(true);
    showToast('Business Code berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="posa-admin-page">
      <AdminHeader title="Company Settings" />

      <div className="space-y-4">
        {/* 1. Company Information */}
        <div className="posa-admin-card">
          <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold text-sm">
            <Building2 size={16} />
            <span>Company information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted">Company name</div>
              <div className="text-white font-semibold mt-0.5 text-base">
                {settings.store_name || 'Staycy_2026'}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted">Email</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-white font-medium">{settings.store_email || 'hamdirafi310@gmail.com'}</span>
                <span className="text-emerald-400 text-xs flex items-center gap-0.5">
                  <Check size={12} /> Verified
                </span>
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:underline ml-1"
                  onClick={() => showToast('Ubah email perusahaan')}
                >
                  Change
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted">WhatsApp</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-white font-medium">{settings.store_phone || '6283871983300'}</span>
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:underline ml-1"
                  onClick={() => showToast('Ubah nomor WhatsApp')}
                >
                  Change
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted">Business Code</div>
              <div className="flex items-center gap-2 mt-0.5">
                <code className="text-slate-300 text-xs bg-[#0b0e17] px-2 py-1 rounded font-mono">
                  {businessCode}
                </code>
                <button
                  type="button"
                  className="posa-action-icon-btn"
                  onClick={handleCopyCode}
                  title="Copy Business Code"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-[11px] text-muted mt-1">
                Share this with posa support if you need help, so we can find your company.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Account Password */}
        <div className="posa-admin-card flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-950/40 border border-blue-500/20 rounded-lg text-blue-400 mt-1">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Account password</h3>
              <p className="text-xs text-muted max-w-xl mt-1">
                The account password connects a new device to your company. It is also asked for to delete the company. The PIN (6 digits) is for signing in every day on a connected device.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                <Check size={13} />
                <span>Password set.</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="posa-btn-outline"
            onClick={() => showToast('Ubah kata sandi akun')}
          >
            Change
          </button>
        </div>

        {/* 3. Connected Devices */}
        <div className="posa-admin-card flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-950/40 border border-blue-500/20 rounded-lg text-blue-400 mt-1">
              <Laptop size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Connected devices</h3>
              <p className="text-xs text-muted max-w-xl mt-1">
                Lost a tablet, or someone left who had a device connected? Sign out every other device. They will need the account password again.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="posa-btn-outline"
            onClick={() => showToast('Semua perangkat lain telah dikeluarkan')}
          >
            Sign out others
          </button>
        </div>

        {/* 4. Queue Numbers */}
        <div className="posa-admin-card flex justify-between items-center">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-950/40 border border-blue-500/20 rounded-lg text-blue-400 mt-1">
              <Ticket size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Queue numbers</h3>
              <p className="text-xs text-muted max-w-xl mt-1">
                Every order gets a number (1, 2, 3...) that starts again each day. It shows after payment and is printed on the receipt, so you can call the order out when it's ready. Useful for cafés.
              </p>
            </div>
          </div>

          <label className="posa-switch">
            <input
              type="checkbox"
              checked={queueNumbers}
              onChange={(e) => {
                setQueueNumbers(e.target.checked);
                updateSettings({ queue_numbers: e.target.checked });
              }}
            />
            <span className="posa-slider" />
          </label>
        </div>

        {/* 5. Till Settings */}
        <div className="posa-admin-card">
          <h2 className="posa-card-title">Till settings</h2>
          <p className="posa-card-subtitle">
            How orders are taken and printed, for every till of this company.
          </p>

          {/* Order types */}
          <div className="mt-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold mb-3">
              <Store size={15} />
              <span>Order types</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-white">Dine in</span>
                <span className="text-xs text-muted">Always on</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-white">Takeaway</span>
                <label className="posa-switch">
                  <input
                    type="checkbox"
                    checked={takeaway}
                    onChange={(e) => setTakeaway(e.target.checked)}
                  />
                  <span className="posa-slider" />
                </label>
              </div>
            </div>

            <button
              type="button"
              className="text-xs text-blue-400 font-semibold hover:underline mt-2 inline-block"
              onClick={() => showToast('Tambah tipe pesanan kustom')}
            >
              + Add your own order type
            </button>
          </div>

          {/* Delivery apps */}
          <div className="mt-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold mb-1">
              <Bike size={15} />
              <span>Delivery apps</span>
            </div>
            <p className="text-xs text-muted mb-3">
              GoFood, GrabFood and ShopeeFood orders: priced for the app, paid through the app (not into the cash drawer).
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-white">GoFood</span>
                <label className="posa-switch">
                  <input
                    type="checkbox"
                    checked={goFood}
                    onChange={(e) => setGoFood(e.target.checked)}
                  />
                  <span className="posa-slider" />
                </label>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-white">GrabFood</span>
                <label className="posa-switch">
                  <input
                    type="checkbox"
                    checked={grabFood}
                    onChange={(e) => setGrabFood(e.target.checked)}
                  />
                  <span className="posa-slider" />
                </label>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-white">ShopeeFood</span>
                <label className="posa-switch">
                  <input
                    type="checkbox"
                    checked={shopeeFood}
                    onChange={(e) => setShopeeFood(e.target.checked)}
                  />
                  <span className="posa-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Supervisor Approval */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold mb-1">
              <ShieldCheck size={15} />
              <span>Supervisor approval</span>
            </div>
            <p className="text-xs text-muted mb-3">
              Needs the owner's or a supervisor's PIN at the till. Stops discounts for friends and voids after taking the cash.
            </p>
          </div>
        </div>

        {/* 6. Payment: QRIS */}
        <div className="posa-admin-card">
          <h2 className="posa-card-title mb-1">Payment: QRIS</h2>
          <p className="posa-card-subtitle mb-4">
            Upload the QRIS code from your bank or payment provider. It's shown to customers when they pay by QRIS.
          </p>

          <div className="flex items-center gap-6">
            <div className="w-36 h-36 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg">
              <img
                src="/QRIS.jpeg"
                alt="QRIS Staycy"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <button
              type="button"
              className="posa-btn-outline"
              onClick={() => showToast('Membuka file dialog Unggah QRIS')}
            >
              <Upload size={16} />
              <span>Upload QRIS</span>
            </button>
          </div>
        </div>

        {/* 7. Danger Zone */}
        <div className="posa-danger-zone-card">
          <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
            <AlertTriangle size={18} />
            <span>Danger Zone</span>
          </div>

          <h3 className="text-white font-semibold text-sm mb-1">Delete Company Account</h3>
          <p className="text-xs text-red-300/80 mb-4">
            Warning: This action is permanent and cannot be undone. This will permanently delete your company profile, all your staff accounts, menus, recipes, raw materials, and transaction histories.
          </p>

          <div className="space-y-3 max-w-md">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Type "CONFIRM" below to authorize deletion</label>
              <input
                type="text"
                className="posa-input w-full"
                placeholder='Type "CONFIRM"'
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Account password</label>
              <input
                type="password"
                className="posa-input w-full"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
