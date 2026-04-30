'use client';
import ProfileContainerSection from '@/components/section/(private)/user/profile/profile-section';
import { SidebarLayout } from '@/core/layouts/sidebar.layout';
import { useApi } from '@/hooks/useApi/props.api';

const ProfileContainer = () => {
  const service = useApi();

  const logout = service.auth.mutation.logout();
  const mutateLogout = () => {
    logout.mutate();
  };
  return (
    <SidebarLayout>
      <ProfileContainerSection
        service={{
          mutate: {
            isPending: logout.isPending,
            onLogout: mutateLogout,
          },
        }}
      />
    </SidebarLayout>
  );
};

export default ProfileContainer;
