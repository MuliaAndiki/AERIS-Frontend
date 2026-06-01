'use client';

import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/core/layouts/sidebar.layout';
import { useApi } from '@/hooks/useApi/props.api';
import { useGetMe } from '@/hooks/useApi/user';

export default function ProfileContainer() {
  const router = useRouter();
  const { data: meData, isLoading, isError } = useGetMe();
  const user = meData?.data;
  const service = useApi();
  const logoutMutate = service.auth.mutation.logout();

  const handleLogout = () => {
    logoutMutate.mutate();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-background text-foreground pb-safe">
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[500px] h-[500px] rounded-full blur-[180px] opacity-20 -top-40 -left-20 bg-primary" />
            <div className="absolute w-[350px] h-[350px] rounded-full blur-[140px] opacity-10 top-20 right-0 bg-accent" />
          </div>

          <div className="relative mx-auto max-w-4xl space-y-2 px-4 py-6 sm:px-6 sm:py-8">
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[13px] font-medium">Kembali</span>
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
              </div>
            ) : isError || !user ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                  <Shield size={28} className="text-destructive" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">Gagal memuat profil</h2>
                <p className="text-[13px] text-muted-foreground mb-6">
                  Coba lagi nanti atau periksa koneksimu.
                </p>
                <Button variant="outline" onClick={() => router.refresh()}>
                  Coba Lagi
                </Button>
              </div>
            ) : (
              <>
                {/* Profile Card */}
                <div className="card-glass rounded-3xl overflow-hidden border border-border shadow-enhanced">
                  {/* Top banner */}
                  <div className="h-32 gradient-primary relative">
                    <div
                      className="absolute inset-0 z-0 opacity-20"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                      }}
                    />
                  </div>

                  {/* Avatar & Name */}
                  <div className="px-4 pb-6 sm:px-8 sm:pb-8">
                    <div className="flex flex-col gap-4 -mt-12 sm:flex-row sm:items-end sm:gap-5">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="relative w-24 h-24 rounded-2xl border-4 border-background gradient-primary flex items-center justify-center text-3xl font-bold overflow-hidden shadow-enhanced">
                          {user.avaUrl ? (
                            <Image
                              src={user.avaUrl}
                              alt={user.fullName}
                              fill
                              className="object-cover"
                              sizes="96px"
                              unoptimized={!user.avaUrl.includes('res.cloudinary.com')}
                            />
                          ) : (
                            <span className="text-primary-foreground">
                              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-success border-2 border-background flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-success-foreground" />
                        </div>
                      </div>

                      {/* Name + Role */}
                      <div className="flex-1 pt-2 flex gap-2 ">
                        <h1 className="text-2xl font-bold text-foreground">{user.fullName}</h1>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                              user.role === 'ADMIN'
                                ? 'bg-destructive/10 text-destructive border-destructive/20'
                                : 'bg-primary/10 text-primary border-primary/20'
                            }`}
                          >
                            <Shield size={10} />
                            {user.role}
                          </span>
                          {user.isVerify && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-success/10 text-success border border-success/20">
                              ✓ Terverifikasi
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Edit button */}
                      <Link href="/user/map/profile/edit" className="w-full sm:w-auto">
                        <Button className="h-11 w-full px-5 rounded-xl text-sm font-semibold sm:h-10 sm:w-auto sm:text-[13px]">
                          <Edit3 size={14} className="mr-2" />
                          Edit Profil
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Contact Info */}
                  <div className="card-glass rounded-2xl p-6 border border-border shadow-enhanced">
                    <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-primary/70 mb-5">
                      Informasi Kontak
                    </h3>
                    <div className="space-y-4">
                      <InfoRow
                        icon={<Mail size={15} className="text-info" />}
                        iconBg="bg-info/10"
                        label="Email"
                        value={user.email || '—'}
                      />
                      <InfoRow
                        icon={<Phone size={15} className="text-primary" />}
                        iconBg="bg-primary/10"
                        label="Telepon"
                        value={user.phone || '—'}
                      />
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="card-glass rounded-2xl p-6 border border-border shadow-enhanced">
                    <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-primary/70 mb-5">
                      Detail Akun
                    </h3>
                    <div className="space-y-4">
                      <InfoRow
                        icon={<MapPin size={15} className="text-success" />}
                        iconBg="bg-success/10"
                        label="Lokasi Terakhir"
                        value={
                          user.latestLocation
                            ? `${user.latestLocation.city}, ${user.latestLocation.country}`
                            : 'Belum diatur'
                        }
                      />
                      <InfoRow
                        icon={<CalendarDays size={15} className="text-warning" />}
                        iconBg="bg-warning/10"
                        label="Bergabung Sejak"
                        value={formatDate(user.createdAt)}
                      />
                    </div>
                  </div>
                </div>

                {/* Location detail */}
                {user.latestLocation && (
                  <div className="mt-4 card-glass rounded-2xl p-6 border border-border shadow-enhanced">
                    <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-primary/70 mb-4">
                      Lokasi Pemantauan
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <LocationChip
                        icon={<Globe size={14} className="text-primary" />}
                        label={`${user.latestLocation.city}, ${user.latestLocation.state}`}
                      />
                      <LocationChip
                        icon={<MapPin size={14} className="text-info" />}
                        label={`${user.latestLocation.latitude.toFixed(4)}, ${user.latestLocation.longitude.toFixed(4)}`}
                        mono
                      />
                      <LocationChip
                        icon={null}
                        label={`Radius: ${user.latestLocation.radius} km`}
                      />
                    </div>
                  </div>
                )}

                <Button
                  className="w-full font-semibold mt-4"
                  variant="outline"
                  onClick={handleLogout}
                  disabled={logoutMutate.isPending}
                >
                  {logoutMutate.isPending ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : null}
                  Keluar
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}

function InfoRow({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-[14px] font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function LocationChip({
  icon,
  label,
  mono,
}: {
  icon: React.ReactNode | null;
  label: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border">
      {icon}
      <span className={`text-[12px] text-muted-foreground ${mono ? 'font-mono' : 'font-medium'}`}>
        {label}
      </span>
    </div>
  );
}
