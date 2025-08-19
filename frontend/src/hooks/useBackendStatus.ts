/**
 * Backend Status Management Hook
 * Handles cold start detection, warm-up, and status tracking
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { log } from '../utils/logger';

export type BackendStatus = 'offline' | 'warming' | 'ready' | 'error';

export interface BackendStatusInfo {
  status: BackendStatus;
  message: string;
  estimatedWaitTime?: number;
  lastChecked?: Date;
  warmupStartTime?: Date;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Configuration
const CHECK_INTERVALS = {
  health: 5000,      // Check health every 5 seconds during warmup
  ai: 15000,         // Check AI readiness every 15 seconds
  retry: 30000,      // Retry failed requests every 30 seconds
};

const TIMEOUTS = {
  health: 10000,     // 10 second timeout for health checks
  ai: 20000,         // 20 second timeout for AI tests
  warmup: 180000,    // 3 minute maximum warmup time
};

const WARMUP_MESSAGES = [
  "Backend is starting up...",
  "Initializing AI models...", 
  "Loading LangChain agents...",
  "Almost ready...",
];

export function useBackendStatus() {
  const [statusInfo, setStatusInfo] = useState<BackendStatusInfo>({
    status: 'offline',
    message: 'Checking backend status...',
  });

  const checkIntervalRef = useRef<NodeJS.Timeout>();
  const warmupStartRef = useRef<Date>();
  const currentMessageIndexRef = useRef(0);

  /**
   * Test if backend health endpoint is responding
   */
  const testHealthEndpoint = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.health);

      const response = await fetch(`${BACKEND_URL}/health`, {
        signal: controller.signal,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        log.info('Backend health check successful', { 
          status: response.status,
          hasGoogleApi: data.google_api_configured 
        });
        return true;
      }
      
      return false;
    } catch (error) {
      log.warn('Backend health check failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  }, []);

  /**
   * Test if AI endpoint is ready and responding
   */
  const testAIEndpoint = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.ai);

      const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'test',
          context: { type: 'warmup_test' }
        }),
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        log.info('AI endpoint test successful');
        return true;
      }
      
      return false;
    } catch (error) {
      log.warn('AI endpoint test failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  }, []);

  /**
   * Start the backend warm-up process
   */
  const startWarmup = useCallback(async () => {
    warmupStartRef.current = new Date();
    currentMessageIndexRef.current = 0;
    
    setStatusInfo({
      status: 'warming',
      message: WARMUP_MESSAGES[0],
      estimatedWaitTime: 90, // 90 seconds estimated
      warmupStartTime: warmupStartRef.current,
    });

    log.info('Starting backend warmup process');

    // Trigger warmup by calling health endpoint
    try {
      await testHealthEndpoint();
    } catch (error) {
      log.warn('Initial warmup trigger failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [testHealthEndpoint]);

  /**
   * Update warmup progress message
   */
  const updateWarmupMessage = useCallback(() => {
    if (!warmupStartRef.current) return;

    const elapsed = Date.now() - warmupStartRef.current.getTime();
    const elapsedSeconds = Math.floor(elapsed / 1000);
    
    // Update message every 20 seconds
    const messageIndex = Math.min(
      Math.floor(elapsedSeconds / 20),
      WARMUP_MESSAGES.length - 1
    );
    
    if (messageIndex !== currentMessageIndexRef.current) {
      currentMessageIndexRef.current = messageIndex;
      
      const remainingTime = Math.max(0, 90 - elapsedSeconds);
      
      setStatusInfo(prev => ({
        ...prev,
        message: WARMUP_MESSAGES[messageIndex],
        estimatedWaitTime: remainingTime,
      }));
    }
  }, []);

  /**
   * Check current backend status
   */
  const checkStatus = useCallback(async () => {
    const healthOk = await testHealthEndpoint();
    
    if (!healthOk) {
      setStatusInfo(prev => ({
        ...prev,
        status: 'offline',
        message: 'Backend is offline (starting warmup...)',
        lastChecked: new Date(),
      }));
      
      // Start warmup if not already warming
      if (statusInfo.status !== 'warming') {
        await startWarmup();
      }
      return;
    }

    // Health is OK, now test AI
    const aiOk = await testAIEndpoint();
    
    if (aiOk) {
      // Everything is ready!
      setStatusInfo({
        status: 'ready',
        message: 'AI features ready!',
        lastChecked: new Date(),
      });
      
      // Clear warmup tracking
      warmupStartRef.current = undefined;
      
      // Clear interval since we're ready
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = undefined;
      }
      
      log.info('Backend fully ready - AI features available');
    } else {
      // Health OK but AI not ready - still warming
      if (statusInfo.status !== 'warming') {
        await startWarmup();
      } else {
        updateWarmupMessage();
      }
    }
  }, [testHealthEndpoint, testAIEndpoint, startWarmup, updateWarmupMessage, statusInfo.status]);

  /**
   * Manual retry function
   */
  const retryConnection = useCallback(async () => {
    log.info('Manual retry triggered');
    await checkStatus();
  }, [checkStatus]);

  /**
   * Get user-friendly status message with actions
   */
  const getStatusDisplay = useCallback(() => {
    switch (statusInfo.status) {
      case 'offline':
        return {
          color: 'text-red-400',
          icon: '🔴',
          message: 'Backend offline - Starting warmup...',
          showRetry: false,
        };
      case 'warming':
        const waitTime = statusInfo.estimatedWaitTime || 0;
        return {
          color: 'text-yellow-400',
          icon: '🟡',
          message: `${statusInfo.message} (${waitTime}s remaining)`,
          showRetry: false,
        };
      case 'ready':
        return {
          color: 'text-green-400',
          icon: '🟢',
          message: 'AI features ready!',
          showRetry: false,
        };
      case 'error':
        return {
          color: 'text-red-400',
          icon: '❌',
          message: 'Connection error - Backend might be down',
          showRetry: true,
        };
      default:
        return {
          color: 'text-gray-400',
          icon: '⏳',
          message: 'Checking status...',
          showRetry: false,
        };
    }
  }, [statusInfo]);

  // Initialize and start checking
  useEffect(() => {
    let mounted = true;

    // Initial check
    checkStatus();

    // Set up periodic checking during warmup
    const startPeriodicCheck = () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      
      checkIntervalRef.current = setInterval(() => {
        if (mounted && (statusInfo.status === 'warming' || statusInfo.status === 'offline')) {
          checkStatus();
        }
      }, CHECK_INTERVALS.health);
    };

    // Start periodic checking if not ready
    if (statusInfo.status !== 'ready') {
      startPeriodicCheck();
    }

    // Cleanup
    return () => {
      mounted = false;
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkStatus, statusInfo.status]);

  return {
    statusInfo,
    isReady: statusInfo.status === 'ready',
    isWarming: statusInfo.status === 'warming',
    isOffline: statusInfo.status === 'offline',
    retryConnection,
    getStatusDisplay,
  };
}
