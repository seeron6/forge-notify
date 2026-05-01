// Forge — Notification Service.
//
// Reference implementation. Each adapter implements deliver(payload).
// Routing rules are evaluated in priority order, multiple actions per event.

export type Channel = 'slack' | 'email' | 'sms' | 'in_app';

export interface DeliveryPayload {
  to: string;
  subject?: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface Adapter {
  channel: Channel;
  deliver(payload: DeliveryPayload): Promise<{ ok: boolean; id: string }>;
}

export interface RetryPolicy {
  attempts: number;
  backoff: 'linear' | 'exponential';
}

export interface NotifyConfig {
  adapters: Adapter[];
  retry?: RetryPolicy;
  audit?: boolean;
}

export function createNotificationService(cfg: NotifyConfig) {
  const adapters = new Map(cfg.adapters.map((a) => [a.channel, a]));
  const log: Array<{ at: string; channel: Channel; ok: boolean; id: string }> = [];
  const policy = cfg.retry ?? { attempts: 3, backoff: 'exponential' };

  async function deliver(channel: Channel, payload: DeliveryPayload) {
    const adapter = adapters.get(channel);
    if (!adapter) throw new Error(`No adapter for ${channel}`);
    let lastErr: unknown;
    for (let i = 0; i < policy.attempts; i++) {
      try {
        const r = await adapter.deliver(payload);
        if (cfg.audit) log.push({ at: new Date().toISOString(), channel, ok: r.ok, id: r.id });
        return r;
      } catch (e) {
        lastErr = e;
        const wait = policy.backoff === 'exponential' ? 2 ** i * 100 : 100 * (i + 1);
        await new Promise((r) => setTimeout(r, wait));
      }
    }
    throw lastErr;
  }

  return {
    deliver,
    history: () => [...log],
  };
}
