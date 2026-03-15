import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getScanStatus, startScan, type ScanStatusResponse } from "@/lib/api/leads";

interface UseScanStatusResult {
  scanState: ScanStatusResponse["scanState"];
  scanProgress: number;
  etaMinutes: number | null;
  newLeadsSince: number;
  leadsFound: number;
  lastUpdated: string | null;
  isScanning: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  triggerScan: () => Promise<void>;
}

export function useScanStatus(projectId: string): UseScanStatusResult {
  const [scanStatus, setScanStatus] = useState<ScanStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastPollIsoRef = useRef<string | undefined>(undefined);
  const intervalRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    if (!projectId) return;
    try {
      const status = await getScanStatus(projectId, lastPollIsoRef.current);
      setScanStatus(status);
      lastPollIsoRef.current = new Date().toISOString();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch scan status");
    }
  }, [projectId]);

  const triggerScan = useCallback(async () => {
    if (!projectId) return;
    await startScan(projectId);
    await refresh();
  }, [projectId, refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const isScanningNow = scanStatus?.scanState === "scanning_empty" || scanStatus?.scanState === "scanning_partial";
    if (!isScanningNow) {
      return undefined;
    }

    intervalRef.current = window.setInterval(() => {
      void refresh();
    }, 30_000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refresh, scanStatus?.scanState]);

  const computed = useMemo(() => {
    const state = scanStatus?.scanState ?? "complete";
    const scanning = state === "scanning_empty" || state === "scanning_partial";
    return {
      scanState: state,
      isScanning: scanning,
      scanProgress: scanStatus?.scanProgress ?? 0,
      etaMinutes: scanStatus?.etaMinutes ?? null,
      newLeadsSince: scanStatus?.newLeadsSince ?? 0,
      leadsFound: scanStatus?.leadsFound ?? 0,
      lastUpdated: scanStatus?.lastUpdated ?? null,
    };
  }, [scanStatus]);

  return {
    ...computed,
    error,
    refresh,
    triggerScan,
  };
}

