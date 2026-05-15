export const cacheKey = {
  auth: {
    session: () => ['auth', 'session'] as const,
  },
  user: {
    me: () => ['user', 'me'] as const,
    profile: () => ['user', 'profile'] as const,
  },
  location: {
    detect: () => ['location', 'detect'] as const,
    resolve: () => ['location', 'resolve'] as const,
  },
  environment: {
    airQuality: () => ['environment', 'air-quality'] as const,
    weather: () => ['environment', 'weather'] as const,
    heatRisk: () => ['environment', 'heat-risk'] as const,
    noise: () => ['environment', 'noise'] as const,
    disasterRisk: () => ['environment', 'disaster-risk'] as const,
    greenSpace: () => ['environment', 'green-space'] as const,
    greenSpaceDetail: (greenAreaId: string) =>
      ['environment', 'green-space', 'detail', greenAreaId] as const,
    greenSpaceReviews: (
      greenAreaId: string,
      page = 1,
      limit = 10,
      sort = 'latest',
      filter = 'visible'
    ) => ['environment', 'green-space', 'reviews', greenAreaId, page, limit, sort, filter] as const,
    raw: () => ['environment', 'raw'] as const,
    providers: () => ['environment', 'providers'] as const,
    providerStatus: () => ['environment', 'providers', 'status'] as const,
  },
  insight: {
    list: (snapshotId?: string) => ['insight', 'list', snapshotId ?? 'latest'] as const,
    daily: () => ['insight', 'daily'] as const,
  },
  recommendation: {
    list: (snapshotId?: string) => ['recommendation', 'list', snapshotId ?? 'latest'] as const,
    daily: () => ['recommendation', 'daily'] as const,
  },
  scoring: {
    summary: (snapshotId?: string) => ['scoring', 'summary', snapshotId ?? 'latest'] as const,
    detail: (snapshotId?: string) => ['scoring', 'detail', snapshotId ?? 'latest'] as const,
    preview: () => ['scoring', 'preview'] as const,
  },
  snapshot: {
    current: (locationId?: string) => ['snapshot', 'current', locationId ?? 'latest'] as const,
    history: (locationId?: string, limit?: string) =>
      ['snapshot', 'history', locationId ?? 'latest', limit ?? '20'] as const,
    detail: (snapshotId: string) => ['snapshot', 'detail', snapshotId] as const,
  },
  cache: {
    roots: () => ['cache'] as const,
  },
};
