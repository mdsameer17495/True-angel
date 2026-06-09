/**
 * notificationService.js — Browser Notification API wrapper for True Angel
 *
 * Provides permission management, instant & scheduled notifications,
 * and a simple queue for missed-reminder follow-ups.
 */

// Track scheduled notification timers so they can be cancelled
const scheduledTimers = new Map();

const notificationService = {
  // ── Support check ─────────────────────────────────────────
  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  // ── Permission ────────────────────────────────────────────
  /**
   * Request notification permission from the user.
   * @returns {Promise<'granted'|'denied'|'default'>}
   */
  async requestPermission() {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported in this browser.');
      return 'denied';
    }

    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      // Older browsers use callback-based API
      return new Promise((resolve) => {
        Notification.requestPermission((permission) => {
          resolve(permission);
        });
      });
    }
  },

  /**
   * Get current permission status.
   * @returns {'granted'|'denied'|'default'|'unsupported'}
   */
  getPermission() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  // ── Show notification (immediate) ─────────────────────────
  /**
   * Show a notification immediately.
   * @param {string} title
   * @param {string} body
   * @param {Object} options - {icon, tag, data, onClick, onClose, requireInteraction}
   * @returns {Notification|null}
   */
  showNotification(title, body, options = {}) {
    if (!this.isSupported()) {
      console.warn('Notifications not supported.');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return null;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge || '/icon-72.png',
        tag: options.tag || undefined,
        data: options.data || undefined,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
      });

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
        if (options.onClick) options.onClick(event);
      };

      notification.onclose = () => {
        if (options.onClose) options.onClose();
      };

      notification.onerror = (err) => {
        console.error('Notification error:', err);
        if (options.onError) options.onError(err);
      };

      // Auto-close after timeout (default 10 seconds)
      if (options.autoClose !== false) {
        const timeout = options.autoCloseMs || 10000;
        setTimeout(() => {
          notification.close();
        }, timeout);
      }

      return notification;
    } catch (err) {
      console.error('Failed to create notification:', err);
      return null;
    }
  },

  // ── Schedule notification (delayed) ───────────────────────
  /**
   * Schedule a notification after a delay.
   * @param {string} title
   * @param {string} body
   * @param {number} delayMs - Delay in milliseconds
   * @param {Object} options - Same as showNotification options + {id}
   * @returns {string} Timer ID that can be used to cancel
   */
  scheduleNotification(title, body, delayMs, options = {}) {
    const timerId = options.id || crypto.randomUUID();

    const timer = setTimeout(() => {
      this.showNotification(title, body, options);
      scheduledTimers.delete(timerId);
    }, delayMs);

    scheduledTimers.set(timerId, timer);
    return timerId;
  },

  /**
   * Cancel a scheduled notification.
   * @param {string} timerId
   */
  cancelScheduled(timerId) {
    const timer = scheduledTimers.get(timerId);
    if (timer) {
      clearTimeout(timer);
      scheduledTimers.delete(timerId);
    }
  },

  /**
   * Cancel all scheduled notifications.
   */
  cancelAllScheduled() {
    for (const [id, timer] of scheduledTimers) {
      clearTimeout(timer);
      scheduledTimers.delete(id);
    }
  },

  /**
   * Get count of currently scheduled notifications.
   * @returns {number}
   */
  getScheduledCount() {
    return scheduledTimers.size;
  },

  // ── Medicine reminder helpers ─────────────────────────────
  /**
   * Schedule a medicine reminder.
   * @param {Object} medicine - {id, name, dosage, dosageUnit, time}
   * @param {number} delayMs
   * @returns {string} Timer ID
   */
  scheduleMedicineReminder(medicine, delayMs) {
    return this.scheduleNotification(
      `💊 Time for ${medicine.name}`,
      `Take ${medicine.dosage} ${medicine.dosageUnit} — scheduled for ${medicine.time}`,
      delayMs,
      {
        id: `med-${medicine.id}-${medicine.time}`,
        tag: `medicine-${medicine.id}`,
        requireInteraction: true,
        data: { type: 'medicine', medicineId: medicine.id },
      }
    );
  },

  /**
   * Schedule a follow-up notification for a missed dose.
   * @param {Object} medicine - {id, name}
   * @param {number} delayMs - How long after the original time to send follow-up
   * @returns {string} Timer ID
   */
  scheduleMissedFollowUp(medicine, delayMs = 15 * 60 * 1000) {
    return this.scheduleNotification(
      `⚠️ Missed: ${medicine.name}`,
      `You haven't marked "${medicine.name}" as taken. Did you forget?`,
      delayMs,
      {
        id: `missed-${medicine.id}-${Date.now()}`,
        tag: `missed-${medicine.id}`,
        requireInteraction: true,
        data: { type: 'missed_medicine', medicineId: medicine.id },
      }
    );
  },
};

export default notificationService;
