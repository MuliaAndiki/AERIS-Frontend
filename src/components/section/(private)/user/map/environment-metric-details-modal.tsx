'use client';

import { AlertCircle, Droplets, Flame, MapPin, Volume2, Wind } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { theme } from '@/configs/theme.config';
import { EnvironmentalMetric } from '@/types/partial/maps';

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function getMetricIcon(metricId?: string) {
  switch (metricId) {
    case 'heat-risk':
      return Flame;
    case 'flood-risk':
      return Droplets;
    case 'noise':
      return Volume2;
    default:
      return Wind;
  }
}

interface EnvironmentMetricDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric?: EnvironmentalMetric | null;
}

const EnvironmentMetricDetailsModal: React.FC<EnvironmentMetricDetailsModalProps> = ({
  isOpen,
  onClose,
  metric,
}) => {

  if (!metric) {
    return null;
  }

  const MetricIcon = getMetricIcon(metric.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        style={{
          backgroundColor: 'white',
          border: `1px solid ${theme.border}`,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: theme.foreground }}>{metric.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: theme.background }}
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${metric.color ?? theme.primary.background}15` }}
            >
              <MetricIcon size={18} style={{ color: metric.color ?? theme.primary.background }} />
            </div>
            <div>
              <p className="text-[12px] font-semibold" style={{ color: theme.foreground }}>
                {metric.value}
                <span className="ml-1 text-[10px]" style={{ color: theme.muted.foreground }}>
                  {metric.unit}
                </span>
              </p>
              <Badge
                variant="secondary"
                className="text-[10px] mt-1"
                style={{
                  backgroundColor: `${metric.color ?? theme.primary.background}20`,
                  color: metric.color ?? theme.primary.background,
                  border: 'none',
                }}
              >
                {metric.level}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: theme.background }}
            >
              <MapPin size={16} style={{ color: theme.primary.background, marginTop: 2 }} />
              <div>
                <p style={{ color: theme.foreground }} className="text-[12px] font-semibold">
                  Coordinates
                </p>
                <p style={{ color: theme.muted.foreground }} className="text-[11px] mt-1">
                  {isNumber(metric.latitude) && isNumber(metric.longitude)
                    ? `${metric.latitude.toFixed(4)}, ${metric.longitude.toFixed(4)}`
                    : 'Coordinates unavailable'}
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: theme.background }}
            >
              <div
                className="h-4 w-4 mt-1 rounded-full"
                style={{ backgroundColor: metric.color ?? theme.primary.background }}
              />
              <div>
                <p style={{ color: theme.foreground }} className="text-[12px] font-semibold">
                  Radius
                </p>
                <p style={{ color: theme.muted.foreground }} className="text-[11px] mt-1">
                  {isNumber(metric.radiusKm) ? `${metric.radiusKm} km` : 'Radius unavailable'}
                </p>
              </div>
            </div>

            {metric.description && (
              <p style={{ color: theme.muted.foreground }} className="text-sm leading-relaxed">
                {metric.description}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="min-h-10 flex-1 text-sm sm:text-xs"
              onClick={() => {
                if (!isNumber(metric.latitude) || !isNumber(metric.longitude)) return;
                window.open(
                  `https://www.google.com/maps/search/${metric.latitude},${metric.longitude}`,
                  '_blank'
                );
              }}
              style={{
                borderColor: theme.border,
                color: theme.primary.background,
              }}
            >
              View on Map
            </Button>
            <Button
              className="min-h-10 flex-1 text-sm sm:text-xs"
              onClick={onClose}
              style={{
                backgroundColor: theme.primary.background,
                color: 'white',
              }}
            >
              Close
            </Button>
          </div>

          <div
            className="flex items-start gap-2 p-3 rounded-lg"
            style={{
              backgroundColor: `${theme.destructive.background}15`,
              borderLeft: `3px solid ${theme.destructive.background}`,
            }}
          >
            <AlertCircle size={14} style={{ color: theme.destructive.background, marginTop: 2 }} />
            <p style={{ color: theme.destructive.background }} className="text-xs">
              Area ini menampilkan zona dampak untuk {metric.label.toLowerCase()} sesuai radius yang
              dihitung dari lokasi.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnvironmentMetricDetailsModal;
