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
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/core/layouts/sidebar.layout';
import { useApi } from '@/hooks/useApi/props.api';
import { useGetMe } from '@/hooks/useApi/user';
import { useAuthStore } from '@/stores/auth.store';

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
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#080F0C] via-[#0d1a14] to-[#080F0C] text-white pb-safe">
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0">
            <div
              className="absolute w-[600px] h-[600px] rounded-full blur-[200px] opacity-15 -top-40 -left-20"
              style={{ background: 'radial-gradient(circle, #248277, transparent)' }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full blur-[160px] opacity-10 top-20 right-0"
              style={{ background: 'radial-gradient(circle, #67B99A, transparent)' }}
            />
          </div>

          <div className="relative mx-auto max-w-4xl space-y-2 px-4 py-6 sm:px-6 sm:py-8">
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[13px] font-medium">Back</span>
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400/60" />
              </div>
            ) : isError || !user ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Shield size={28} className="text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white/80 mb-2">Failed to load profile</h2>
                <p className="text-[13px] text-white/40 mb-6">
                  Please try again later or check your connection.
                </p>
                <Button
                  onClick={() => router.refresh()}
                  className="bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                {/* Profile Card */}
                <div
                  className="relative rounded-3xl overflow-hidden border border-white/5"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                  }}
                >
                  {/* Top banner */}
                  <div
                    className="h-32 relative"
                    style={{ background: 'linear-gradient(135deg, #248277, #67B99A, #248277)' }}
                  >
                    <div
                      className="absolute inset-0 opacity-20"
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
                        <div
                          className="relative w-24 h-24 rounded-2xl border-4 border-[#0d1a14] flex items-center justify-center text-3xl font-bold overflow-hidden"
                          style={{ background: 'linear-gradient(135deg, #248277, #67B99A)' }}
                        >
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
                            <span className="text-white/90">
                              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-[#0d1a14] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      </div>

                      {/* Name + Role */}
                      <div className="flex-1 pb-1">
                        <h1 className="text-2xl font-bold text-white/90">{user.fullName}</h1>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                            style={{
                              background:
                                user.role === 'ADMIN'
                                  ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))'
                                  : 'linear-gradient(135deg, rgba(36,130,119,0.15), rgba(36,130,119,0.05))',
                              color: user.role === 'ADMIN' ? '#ef4444' : '#67B99A',
                              border: `1px solid ${user.role === 'ADMIN' ? 'rgba(239,68,68,0.2)' : 'rgba(103,185,154,0.2)'}`,
                            }}
                          >
                            <Shield size={10} />
                            {user.role}
                          </span>
                          {user.isVerify && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Edit button */}
                      <Link href="/user/map/profile/edit" className="w-full sm:w-auto">
                        <Button
                          className="h-11 w-full px-5 rounded-xl text-sm font-semibold text-[#080F0C] hover:scale-105 transition-all sm:h-10 sm:w-auto sm:text-[13px]"
                          style={{
                            background: 'linear-gradient(135deg, #67B99A, #248277)',
                            boxShadow: '0 8px 24px rgba(36,130,119,0.25)',
                          }}
                        >
                          <Edit3 size={14} className="mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Contact Info */}
                  <div
                    className="rounded-2xl p-6 border border-white/5"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                    }}
                  >
                    <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-400/70 mb-5">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <Mail size={15} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
                            Email
                          </p>
                          <p className="text-[14px] font-medium text-white/80">
                            {user.email || '—'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                          <Phone size={15} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
                            Phone
                          </p>
                          <p className="text-[14px] font-medium text-white/80">
                            {user.phone || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Account */}
                  <div
                    className="rounded-2xl p-6 border border-white/5"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                    }}
                  >
                    <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-400/70 mb-5">
                      Account Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <MapPin size={15} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
                            Latest Location
                          </p>
                          <p className="text-[14px] font-medium text-white/80">
                            {user.latestLocation
                              ? `${user.latestLocation.city}, ${user.latestLocation.country}`
                              : 'No location set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <CalendarDays size={15} className="text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
                            Member Since
                          </p>
                          <p className="text-[14px] font-medium text-white/80">
                            {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location map preview */}
                {user.latestLocation && (
                  <div
                    className="mt-6 rounded-2xl p-6 border border-white/5"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                    }}
                  >
                    <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-400/70 mb-4">
                      Monitoring Location
                    </h3>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
                        <Globe size={14} className="text-emerald-400" />
                        <span className="text-[12px] font-medium text-white/70">
                          {user.latestLocation.city}, {user.latestLocation.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
                        <MapPin size={14} className="text-blue-400" />
                        <span className="text-[12px] font-mono text-white/50">
                          {user.latestLocation.latitude.toFixed(4)},{' '}
                          {user.latestLocation.longitude.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[12px] font-medium text-white/50">
                          Radius:{' '}
                          <span className="text-white/70">{user.latestLocation.radius} km</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full font-semibold"
                  onClick={() => handleLogout()}
                  disabled={logoutMutate.isPending}
                >
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
