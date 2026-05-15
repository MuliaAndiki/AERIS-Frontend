import { Menu, Map as MapIcon, BarChart3, Info } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { cn } from '@/utils/classname';
import { Button } from '@/components/ui/button';
import { themeConfig } from '@/configs/theme.config';

import GreenSpaceDetailsModal from './green-space-details-modal';
import { MapScreenSectionProps } from '@/types/ui/maps';
import { EnvironmentalSummaryPanel } from '@/components/partial/maps/EnvironmentalSummaryPanel';
import { MapContainer } from '@/components/partial/maps/MapsController';
import { InsightsPanel } from '@/components/partial/maps/InsightsPanel';

const MapScreenSection: React.FC<MapScreenSectionProps> = ({ state = {}, service = {} }) => {
  const theme = themeConfig.light;

  // Destructure state with defaults
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
    error = null,
    isCurrentLocationDetected = true,
    detectedLocation = null,
  } = state;

  // Destructure service handlers
  const { onAlertClick = () => {}, onGreenSpaceClick = () => {} } = service;

  // ══ LOCAL STATE ══
  const [selectedGreenSpaceId, setSelectedGreenSpaceId] = useState<string | null>(null);
  const [isGreenSpaceModalOpen, setIsGreenSpaceModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'map' | 'summary' | 'insights'>('map');

  // Handle green space click
  const handleGreenSpaceClick = (spaceId: string) => {
    const space = greenSpaces.find((s) => s.id === spaceId);
    if (space) {
      setSelectedGreenSpaceId(spaceId);
      setIsGreenSpaceModalOpen(true);
      onGreenSpaceClick?.(spaceId);
    }
  };

  // Cycle mobile tab
  const cycleMobileTab = () => {
    const tabs: ('map' | 'summary' | 'insights')[] = ['map', 'summary', 'insights'];
    const currentIndex = tabs.indexOf(activeMobileTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveMobileTab(tabs[nextIndex]);
  };

  // Show loading state with dynamic messages
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    'Establishing secure connection...',
    'Detecting geographical coordinates...',
    'Fetching Air Quality Index (AQI)...',
    'Analyzing urban heat islands...',
    'Estimating noise pollution levels...',
    'Querying flood risk from ThinkHazard...',
    'Locating nearby green spaces...',
    'Calculating global environmental score...',
    'Generating AI-powered insights...',
  ];

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [loading]);

  if (loading) {
    return (
      <section
        className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: theme.foreground }}
      >
        {/* Background glow */}
        <div className="absolute inset-0">
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              background: `radial-gradient(circle, ${theme.primary.background}, transparent)`,
            }}
          />
        </div>

        <div className="text-center z-10 max-w-sm w-full px-6">
          {/* Animated rings */}
          <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed opacity-20 animate-[spin_8s_linear_infinite]"
              style={{ borderColor: theme.primary.background }}
            />
            <div
              className="absolute inset-2 rounded-full border-2 border-dotted opacity-40 animate-[spin_4s_linear_infinite_reverse]"
              style={{ borderColor: theme.success.background }}
            />
            <div
              className="absolute inset-4 rounded-full border-t-2 border-r-2 opacity-80 animate-spin"
              style={{ borderColor: theme.primary.background }}
            />

            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#248277] to-[#67B99A] animate-pulse shadow-[0_0_20px_rgba(36,130,119,0.5)]">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Syncing Environment</h3>

          {/* Cycling text */}
          <div className="h-6 overflow-hidden relative mb-6">
            {loadingMessages.map((msg, idx) => (
              <p
                key={idx}
                className="absolute inset-0 w-full text-[13px] transition-all duration-500 flex items-center justify-center"
                style={{
                  color: theme.muted.foreground,
                  opacity: loadingStep === idx ? 1 : 0,
                  transform:
                    loadingStep === idx
                      ? 'translateY(0)'
                      : loadingStep < idx
                        ? 'translateY(-100%)'
                        : 'translateY(100%)',
                }}
              >
                {msg}
              </p>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: `${((loadingStep + 1) / loadingMessages.length) * 100}%`,
                background: 'linear-gradient(90deg, #248277, #67B99A)',
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full h-screen flex flex-col  overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      {/* ══ MAIN CONTENT ══ */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Environmental Summary Panel - Toggleable on Mobile, Sidebar on Desktop */}
        <div
          className={cn(
            'h-full transition-all duration-300 lg:static lg:w-80 lg:block border-r',
            activeMobileTab === 'summary' ? 'fixed inset-0 z-40 block bg-white' : 'hidden lg:block'
          )}
        >
          <EnvironmentalSummaryPanel
            theme={theme}
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

        {/* Map Container - Main view on Desktop, Toggleable on Mobile */}
        <div
          className={cn(
            'flex-1 h-full relative flex flex-col',
            activeMobileTab === 'map' ? 'block' : 'hidden lg:block'
          )}
        >
          <MapContainer
            theme={theme}
            greenSpaces={greenSpaces}
            environmentalScore={environmentalScore}
            location={location}
            latitude={latitude}
            longitude={longitude}
            metrics={metrics}
            onGreenSpaceClick={handleGreenSpaceClick}
          />
        </div>

        {/* Insights Panel - Toggleable on Mobile, Sidebar on Desktop */}
        <div
          className={cn(
            'h-full transition-all duration-300 lg:static lg:w-80 lg:block border-l',
            activeMobileTab === 'insights' ? 'fixed inset-0 z-40 block bg-white' : 'hidden lg:block'
          )}
        >
          <InsightsPanel
            theme={theme}
            alerts={alerts}
            recommendations={recommendations}
            greenSpaces={greenSpaces}
            scoreHistory={scoreHistory}
            onAlertClick={onAlertClick}
            onGreenSpaceClick={handleGreenSpaceClick}
          />
        </div>

        {/* Mobile View Switcher FAB */}
        <div className="lg:hidden absolute bottom-20 right-6 z-50">
          <Button
            onClick={cycleMobileTab}
            className="w-14 h-14 p-0 rounded-full shadow-2xl flex flex-col items-center justify-center gap-0.5"
            style={{
              backgroundColor: theme.primary.background,
              color: theme.primary.foreground,
            }}
          >
            {activeMobileTab === 'map' && <BarChart3 size={20} />}
            {activeMobileTab === 'summary' && <MapIcon size={20} />}
            {activeMobileTab === 'insights' && <Info size={20} />}
            <span className="text-[9px] font-bold uppercase tracking-tighter">
              {activeMobileTab === 'map'
                ? 'Stats'
                : activeMobileTab === 'summary'
                  ? 'Map'
                  : 'Summary'}
            </span>
          </Button>
        </div>

        {/* Green Space Details Modal */}
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
      </div>
    </section>
  );
};

export default MapScreenSection;
