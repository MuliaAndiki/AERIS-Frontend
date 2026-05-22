'use client';

import { AlertCircle, Clock, MapPin, Star, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { themeConfig } from '@/configs/theme.config';
import EnvironmentApi from '@/services/env/env.service';

export interface GreenSpaceDetail {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  status?: string;
  tags: string[];
  description?: string;
  operatingHours?: string;
  averageRating?: number;
  reviewCount?: number;
  amenities?: string[];
  capacity?: number;
  accessibility?: boolean;
  parkingAvailable?: boolean;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

interface GreenSpaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId?: string;
  spaceName?: string;
  latitude?: number;
  longitude?: number;
}

const GreenSpaceDetailsModal: React.FC<GreenSpaceDetailsModalProps> = ({
  isOpen,
  onClose,
  spaceId,
  spaceName = 'Green Space',
  latitude,
  longitude,
}) => {
  const theme = themeConfig.light;
  const [details, setDetails] = useState<GreenSpaceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && spaceId) {
      const minimalDetails: GreenSpaceDetail = {
        id: spaceId,
        name: spaceName,
        latitude,
        longitude,
        tags: [],
      };

      const fetchDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          setDetails(minimalDetails);

          const response = await EnvironmentApi.GreenSpaceDetail(spaceId);
          if (!response.data) {
            setError('Detail green space tidak tersedia dari server.');
            return;
          }

          const detail = response.data;
          setDetails({
            id: detail.id,
            name: detail.name,
            latitude: detail.latitude,
            longitude: detail.longitude,
            tags: [],
            averageRating: detail.averageRating,
            reviewCount: detail.totalReviews,
            capacity: isNumber(detail.areaSize) ? Math.round(detail.areaSize) : undefined,
          });
        } catch (err) {
          setError('Unable to load space details from API');
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [isOpen, spaceId, spaceName, latitude, longitude]);

  if (!details) {
    return null;
  }

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
          <DialogTitle style={{ color: theme.foreground }}>{details.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              style={{
                backgroundColor: `${theme.success.background}20`,
                color: theme.success.background,
                border: 'none',
              }}
            >
              {details.status ?? 'Unknown'}
            </Badge>
            <span style={{ color: theme.muted.foreground }} className="text-xs">
              {isNumber(details.distance) ? `${details.distance} km away` : 'Distance unavailable'}
            </span>
          </div>

          {/* Description */}
          {details.description && (
            <p style={{ color: theme.muted.foreground }} className="text-sm leading-relaxed">
              {details.description}
            </p>
          )}

          {/* Operating Hours */}
          <div
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: theme.background }}
          >
            <Clock size={16} style={{ color: theme.primary.background, marginTop: 2 }} />
            <div>
              <p style={{ color: theme.foreground }} className="text-[12px] font-semibold">
                Operating Hours
              </p>
              <p style={{ color: theme.muted.foreground }} className="text-[11px] mt-1">
                {details.operatingHours}
              </p>
            </div>
          </div>

          {/* Location */}
          <div
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: theme.background }}
          >
            <MapPin size={16} style={{ color: theme.primary.background, marginTop: 2 }} />
            <div>
              <p style={{ color: theme.foreground }} className="text-[12px] font-semibold">
                Location
              </p>
              <p style={{ color: theme.muted.foreground }} className="text-[11px] mt-1">
                {isNumber(details.latitude) && isNumber(details.longitude)
                  ? `${details.latitude.toFixed(4)}, ${details.longitude.toFixed(4)}`
                  : 'Coordinates unavailable'}
              </p>
            </div>
          </div>

          {/* Amenities */}
          {details.amenities && details.amenities.length > 0 && (
            <div>
              <p style={{ color: theme.foreground }} className="text-[12px] font-semibold mb-2">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {details.amenities.map((amenity, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-[10px] px-2 py-1"
                    style={{
                      color: theme.secondary.foreground,
                      borderColor: theme.border,
                    }}
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {details.tags && details.tags.length > 0 && (
            <div>
              <p style={{ color: theme.foreground }} className="text-[12px] font-semibold mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {details.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-[10px] px-2 py-1"
                    style={{
                      backgroundColor: `${theme.secondary.background}20`,
                      color: theme.secondary.foreground,
                      border: 'none',
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg"
              style={{
                backgroundColor: `${theme.destructive.background}15`,
                borderLeft: `3px solid ${theme.destructive.background}`,
              }}
            >
              <AlertCircle
                size={14}
                style={{ color: theme.destructive.background, marginTop: 2 }}
              />
              <p style={{ color: theme.destructive.background }} className="text-xs">
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => {
                if (!isNumber(details.latitude) || !isNumber(details.longitude)) return;
                const mapUrl = `https://www.google.com/maps/search/${details.latitude},${details.longitude}`;
                window.open(mapUrl, '_blank');
              }}
              style={{
                borderColor: theme.border,
                color: theme.primary.background,
              }}
            >
              View on Map
            </Button>
            <Button
              className="flex-1 text-xs"
              onClick={onClose}
              style={{
                backgroundColor: theme.primary.background,
                color: 'white',
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GreenSpaceDetailsModal;
