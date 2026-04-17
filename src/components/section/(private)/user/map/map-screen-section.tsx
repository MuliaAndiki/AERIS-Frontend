import { Menu } from 'lucide-react';
import React, { useRef, useState } from 'react';
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

  // ══ LOCAL STATE FOR MODAL ══
  const [selectedGreenSpaceId, setSelectedGreenSpaceId] = useState<string | null>(null);
  const [isGreenSpaceModalOpen, setIsGreenSpaceModalOpen] = useState(false);

  // Handle green space click
  const handleGreenSpaceClick = (spaceId: string) => {
    const space = greenSpaces.find((s) => s.id === spaceId);
    if (space) {
      setSelectedGreenSpaceId(spaceId);
      setIsGreenSpaceModalOpen(true);
      onGreenSpaceClick?.(spaceId);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-opacity-30 border-t-opacity-100 animate-spin mx-auto mb-4"
            style={{
              borderColor: `${theme.primary.background}30`,
              borderTopColor: theme.primary.background,
            }}
          />
          <p style={{ color: theme.muted.foreground }}>Loading map data...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      {/* ══ MAIN CONTENT ══ */}
      <div className="flex-1 flex overflow-hidden">
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

        {/* Map Container */}
        <MapContainer
          theme={theme}
          greenSpaces={greenSpaces}
          environmentalScore={environmentalScore}
          location={location}
          latitude={latitude}
          longitude={longitude}
          onGreenSpaceClick={handleGreenSpaceClick}
        />

        {/* Right Panel */}
        <InsightsPanel
          theme={theme}
          alerts={alerts}
          recommendations={recommendations}
          greenSpaces={greenSpaces}
          scoreHistory={scoreHistory}
          onAlertClick={onAlertClick}
          onGreenSpaceClick={handleGreenSpaceClick}
        />

        {/* Mobile FAB */}
        <div className="lg:hidden absolute bottom-6 right-6 z-20">
          <Button
            className="w-12 h-12 p-0 rounded-full"
            style={{
              backgroundColor: theme.primary.background,
              color: theme.primary.foreground,
            }}
          >
            <Menu size={20} />
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
