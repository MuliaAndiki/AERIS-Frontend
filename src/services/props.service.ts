import AuhtApi from '@/services/auth/auth.service';
import LocationApi from '@/services/location/location.service';
import EnvironmentApi from '@/services/env/env.service';

class Api {
  static Auth = AuhtApi;
  static Location = LocationApi;
  static Environment = EnvironmentApi;
}

export default Api;
