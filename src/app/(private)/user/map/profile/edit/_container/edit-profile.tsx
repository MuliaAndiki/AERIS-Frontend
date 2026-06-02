'use client';

import { ArrowLeft, Camera, Check, Loader2, Mail, Phone, Save, User, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/core/layouts/sidebar.layout';
import { useEditProfile, useGetMe } from '@/hooks/useApi/user';

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
      <main className="w-full min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-background text-foreground pb-safe">
        <div className="relative overflow-hidden">
          {/* Background blob */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[500px] h-[500px] rounded-full blur-[180px] opacity-20 -top-40 -left-20 bg-primary" />
          </div>

          <div className="relative mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[13px] font-medium">Kembali ke Profil</span>
            </button>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Edit Profil</h1>
              <p className="text-[13px] text-muted-foreground mt-1">Perbarui informasi pribadimu</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar preview */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <div className="relative mx-auto size-20 shrink-0 overflow-hidden rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold group sm:mx-0 shadow-enhanced">
                    {form.avaUrl ? (
                      <Image
                        src={form.avaUrl}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={!form.avaUrl.includes('res.cloudinary.com')}
                      />
                    ) : (
                      <span className="text-primary-foreground">
                        {form.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} className="text-background" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <FormLabel icon={<Camera size={12} className="text-muted-foreground" />}>
                      URL Avatar
                    </FormLabel>
                    <FormInput
                      type="url"
                      value={form.avaUrl}
                      onChange={(e) => setForm((f) => ({ ...f, avaUrl: e.target.value }))}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <FormLabel icon={<User size={12} className="text-primary/60" />}>
                    Nama Lengkap
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    placeholder="Nama lengkapmu"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <FormLabel icon={<Mail size={12} className="text-info/60" />}>
                    Alamat Email
                  </FormLabel>
                  <FormInput
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="kamu@contoh.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <FormLabel icon={<Phone size={12} className="text-primary/60" />}>
                    Nomor Telepon
                  </FormLabel>
                  <FormInput
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+628xxxxxxxxxx"
                  />
                </div>

                {/* Error */}
                {editProfile.isError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <X size={14} className="text-destructive" />
                    <p className="text-[12px] text-destructive">
                      {(editProfile.error as any)?.response?.data?.message ||
                        'Gagal memperbarui profil'}
                    </p>
                  </div>
                )}

                {/* Success */}
                {saved && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success/10 border border-success/20 animate-in fade-in duration-300">
                    <Check size={14} className="text-success" />
                    <p className="text-[12px] text-success">Profil diperbarui! Mengalihkan...</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push('/user/map/profile')}
                    className="h-11 px-6 rounded-xl text-[13px]"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={!hasChanges || editProfile.isPending || saved}
                    className="h-11 px-8 rounded-xl text-[13px] font-semibold"
                  >
                    {editProfile.isPending ? (
                      <Loader2 size={16} className="animate-spin mr-2" />
                    ) : saved ? (
                      <Check size={16} className="mr-2" />
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
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

function FormLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground flex items-center gap-2 mb-2">
      {icon}
      {children}
    </label>
  );
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-ring transition-all"
    />
  );
}
