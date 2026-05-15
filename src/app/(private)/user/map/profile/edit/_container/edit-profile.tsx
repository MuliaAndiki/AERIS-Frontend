'use client';

import { useGetMe, useEditProfile } from '@/hooks/useApi/user';
import { SidebarLayout } from '@/core/layouts/sidebar.layout';
import {
  ArrowLeft,
  Camera,
  Check,
  Loader2,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditProfileContainer() {
  const router = useRouter();
  const { data: meData, isLoading } = useGetMe();
  const editProfile = useEditProfile();
  const user = meData?.data;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    avaUrl: '',
  });
  const [saved, setSaved] = useState(false);

  // Populate form when data arrives
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        avaUrl: user.avaUrl || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, string> = {};
    if (form.fullName !== (user?.fullName || '')) payload.fullName = form.fullName;
    if (form.email !== (user?.email || '')) payload.email = form.email;
    if (form.phone !== (user?.phone || '')) payload.phone = form.phone;
    if (form.avaUrl !== (user?.avaUrl || '')) payload.avaUrl = form.avaUrl;

    if (Object.keys(payload).length === 0) {
      router.push('/user/map/profile');
      return;
    }

    editProfile.mutate(payload, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => {
          router.push('/user/map/profile');
        }, 1200);
      },
    });
  };

  const hasChanges =
    form.fullName !== (user?.fullName || '') ||
    form.email !== (user?.email || '') ||
    form.phone !== (user?.phone || '') ||
    form.avaUrl !== (user?.avaUrl || '');

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen bg-gradient-to-br from-[#080F0C] via-[#0d1a14] to-[#080F0C] text-white">
        <div className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div
              className="absolute w-[600px] h-[600px] rounded-full blur-[200px] opacity-15 -top-40 -left-20"
              style={{ background: 'radial-gradient(circle, #248277, transparent)' }}
            />
          </div>

          <div className="relative max-w-2xl mx-auto px-6 py-8">
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[13px] font-medium">Back to Profile</span>
            </button>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white/90">Edit Profile</h1>
              <p className="text-[13px] text-white/35 mt-1">Update your personal information</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400/60" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar preview */}
                <div className="flex items-center gap-5">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold overflow-hidden relative group"
                    style={{ background: 'linear-gradient(135deg, #248277, #67B99A)' }}
                  >
                    {form.avaUrl ? (
                      <img src={form.avaUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/90">
                        {form.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 block mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={form.avaUrl}
                      onChange={(e) => setForm((f) => ({ ...f, avaUrl: e.target.value }))}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white/80 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 flex items-center gap-2 mb-2">
                    <User size={12} className="text-emerald-400/60" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    placeholder="Your full name"
                    required
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white/90 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 flex items-center gap-2 mb-2">
                    <Mail size={12} className="text-blue-400/60" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white/90 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 flex items-center gap-2 mb-2">
                    <Phone size={12} className="text-purple-400/60" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+628xxxxxxxxxx"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[14px] text-white/90 placeholder:text-white/20 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Error message */}
                {editProfile.isError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <X size={14} className="text-red-400" />
                    <p className="text-[12px] text-red-300">
                      {(editProfile.error as any)?.response?.data?.message ||
                        'Failed to update profile'}
                    </p>
                  </div>
                )}

                {/* Success message */}
                {saved && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in duration-300">
                    <Check size={14} className="text-emerald-400" />
                    <p className="text-[12px] text-emerald-300">Profile updated! Redirecting...</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push('/user/profile')}
                    className="h-11 px-6 rounded-xl text-[13px] text-white/50 hover:text-white/80 hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!hasChanges || editProfile.isPending || saved}
                    className="h-11 px-8 rounded-xl text-[13px] font-semibold text-[#080F0C] disabled:opacity-40 hover:scale-105 transition-all"
                    style={{
                      background:
                        hasChanges && !saved
                          ? 'linear-gradient(135deg, #67B99A, #248277)'
                          : 'rgba(255,255,255,0.1)',
                      boxShadow: hasChanges ? '0 8px 24px rgba(36,130,119,0.25)' : 'none',
                      color: hasChanges && !saved ? '#080F0C' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {editProfile.isPending ? (
                      <Loader2 size={16} className="animate-spin mr-2" />
                    ) : saved ? (
                      <Check size={16} className="mr-2" />
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    {saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
