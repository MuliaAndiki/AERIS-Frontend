import ProfileContainerSection from '@/components/section/(private)/user/profile/profile-section';
import { SidebarLayout } from '@/core/layouts/sidebar.layout';

const ProfileContainer = () => {
  return (
    <SidebarLayout>
      <ProfileContainerSection />
    </SidebarLayout>
  );
};

export default ProfileContainer;
