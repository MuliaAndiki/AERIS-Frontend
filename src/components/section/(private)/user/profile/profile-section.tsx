import { ButtonWrapper } from '@/components/wrapper/ButtonWrapper';

interface ProfileContainerSectionProps {
  service: {
    mutate: {
      onLogout: () => void;
      isPending: boolean;
    };
  };
}
const ProfileContainerSection: React.FC<ProfileContainerSectionProps> = ({ service }) => {
  return (
    <main className="w-full min-h-screen flex justify-center items-center flex-col">
      <h1>initial</h1>
      <ButtonWrapper onClick={() => service.mutate.onLogout()} disabled={service.mutate.isPending}>
        Keluar
      </ButtonWrapper>
    </main>
  );
};

export default ProfileContainerSection;
