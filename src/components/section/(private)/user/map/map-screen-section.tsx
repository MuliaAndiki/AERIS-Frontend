import { BarChart3, Info, Map as MapIcon, X } from 'lucide-react';
import { useState } from 'react';

import { EnvironmentalSummaryPanel } from '@/components/partial/maps/EnvironmentalSummaryPanel';
import { InsightsPanel } from '@/components/partial/maps/InsightsPanel';
import { MapContainer } from '@/components/partial/maps/MapsController';
import { Button } from '@/components/ui/button';
import { MapScreenSectionProps } from '@/types/ui/maps';
import { cn } from '@/utils/classname';

import EnvironmentMetricDetailsModal from './environment-metric-details-modal';
import GreenSpaceDetailsModal from './green-space-details-modal';
import { MapEnvironmentLoading } from './map-environment-loading';

type MobileTab = 'map' | 'summary' | 'insights';

const MOBILE_TABS: { id: MobileTab; label: string; icon: typeof MapIcon }[] = [
  { id: 'map', label: 'Peta', icon: MapIcon },
  { id: 'summary', label: 'Ringkasan', icon: BarChart3 },
  { id: 'insights', label: 'Insight', icon: Info },
];

function MobilePanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3 pt-safe lg:hidden">
      <h2 className="text-sm font-bold text-primary">{title}</h2>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0"
        onClick={onClose}
        aria-label="Tutup panel"
      >
        <X className="size-5" />
      </Button>
    </div>
  );
}

const MapScreenSection: React.FC<MapScreenSectionProps> = ({ state = {}, service = {} }) => {
  const {
    location,
    latitude,
    longitude,
    environmentalScore = 0,
    metrics = [],
    alerts = [],
    recommendations = [],
    greenSpaces = [],
    scoreHistory = [],
    loading = false,
    isCurrentLocationDetected = true,
    detectedLocation = null,
  } = state;

  const {
    onAlertClick = () => {},
    onGreenSpaceClick = () => {},
    onMetricClick = () => {},
  } = service;

  const [selectedGreenSpaceId, setSelectedGreenSpaceId] = useState<string | null>(null);
  const [isGreenSpaceModalOpen, setIsGreenSpaceModalOpen] = useState(false);
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('map');

  const handleGreenSpaceClick = (spaceId: string) => {
    const space = greenSpaces.find((s) => s.id === spaceId);
    if (space) {
      setSelectedGreenSpaceId(spaceId);
      setIsGreenSpaceModalOpen(true);
      onGreenSpaceClick?.(spaceId);
    }
  };

  const handleMetricClick = (metricId: string) => {
    const metric = metrics.find((item) => item.id === metricId);
    if (metric) {
      setSelectedMetricId(metricId);
      setIsMetricModalOpen(true);
      onMetricClick?.(metricId);
    }
  };

  if (loading) {
    return <MapEnvironmentLoading />;
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div
          className={cn(
            'flex h-full min-h-0 flex-col border-border transition-all duration-300 lg:static lg:w-72 lg:shrink-0 lg:border-r xl:w-80',
            activeMobileTab === 'summary'
              ? 'fixed inset-0 z-40 flex border-r bg-card'
              : 'hidden lg:flex'
          )}
        >
          <MobilePanelHeader
            title="Ringkasan lingkungan"
            onClose={() => setActiveMobileTab('map')}
          />
          <div className="min-h-0 flex-1 overflow-hidden">
            <EnvironmentalSummaryPanel
              location={location}
              score={environmentalScore}
              metrics={metrics}
              recommendations={recommendations}
              alerts={alerts}
              greenSpaces={greenSpaces}
              scoreHistory={scoreHistory}
              isCurrentLocation={isCurrentLocationDetected}
              detectedLocation={detectedLocation}
            />
          </div>
        </div>

        <div
          className={cn(
            'relative flex min-h-0 min-w-0 flex-1 flex-col',
            activeMobileTab === 'map' ? 'flex' : 'hidden lg:flex'
          )}
        >
          <MapContainer
            greenSpaces={greenSpaces}
            environmentalScore={environmentalScore}
            location={location}
            latitude={latitude}
            longitude={longitude}
            metrics={metrics}
            onGreenSpaceClick={handleGreenSpaceClick}
            onMetricClick={handleMetricClick}
          />
        </div>

        <div
          className={cn(
            'flex h-full min-h-0 flex-col border-border transition-all duration-300 lg:static lg:w-72 lg:shrink-0 lg:border-l xl:w-80',
            activeMobileTab === 'insights'
              ? 'fixed inset-0 z-40 flex border-l bg-card'
              : 'hidden lg:flex'
          )}
        >
          <MobilePanelHeader
            title="Insight & rekomendasi"
            onClose={() => setActiveMobileTab('map')}
          />
          <div className="min-h-0 flex-1 overflow-hidden">
            <InsightsPanel
              alerts={alerts}
              recommendations={recommendations}
              greenSpaces={greenSpaces}
              scoreHistory={scoreHistory}
              onAlertClick={onAlertClick}
              onGreenSpaceClick={handleGreenSpaceClick}
            />
          </div>
        </div>

        <nav
          className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border bg-card/95 backdrop-blur-md pb-safe lg:hidden"
          aria-label="Navigasi tampilan peta"
        >
          {MOBILE_TABS.map(({ id, label, icon: Icon }) => {
            const active = activeMobileTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveMobileTab(id)}
                className={cn(
                  'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-xs font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        {selectedGreenSpaceId && (
          <GreenSpaceDetailsModal
            isOpen={isGreenSpaceModalOpen}
            onClose={() => {
              setIsGreenSpaceModalOpen(false);
              setSelectedGreenSpaceId(null);
            }}
            spaceId={selectedGreenSpaceId}
            spaceName={
              greenSpaces.find((s) => s.id === selectedGreenSpaceId)?.name || 'Green Space'
            }
            latitude={greenSpaces.find((s) => s.id === selectedGreenSpaceId)?.latitude}
            longitude={greenSpaces.find((s) => s.id === selectedGreenSpaceId)?.longitude}
          />
        )}

        {selectedMetricId && (
          <EnvironmentMetricDetailsModal
            isOpen={isMetricModalOpen}
            onClose={() => {
              setIsMetricModalOpen(false);
              setSelectedMetricId(null);
            }}
            metric={metrics.find((item) => item.id === selectedMetricId)}
          />
        )}
      </div>
    </section>
  );
};

export default MapScreenSection;
