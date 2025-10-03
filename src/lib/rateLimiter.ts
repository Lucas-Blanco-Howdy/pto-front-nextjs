interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private requests = new Map<string, RateLimitEntry>();
    private readonly maxRequests: number;
    private readonly windowMs: number;

    constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    isAllowed(identifier: string): boolean {
        const now = Date.now();
        const entry = this.requests.get(identifier);

        if (!entry || now > entry.resetTime) {
            this.requests.set(identifier, {
                count: 1,
                resetTime: now + this.windowMs
            });
            return true;
        }

        if (entry.count >= this.maxRequests) {
            return false;
        }

        entry.count++;
        return true;
    }

    getRemainingRequests(identifier: string): number {
        const entry = this.requests.get(identifier);
        if (!entry || Date.now() > entry.resetTime) {
            return this.maxRequests;
        }
        return Math.max(0, this.maxRequests - entry.count);
    }

    getResetTime(identifier: string): number {
        const entry = this.requests.get(identifier);
        return entry ? entry.resetTime : Date.now() + this.windowMs;
    }

    cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.requests.entries()) {
            if (now > entry.resetTime) {
                this.requests.delete(key);
            }
        }
    }
}

export const candidateLimiter = new RateLimiter(30, 15 * 60 * 1000); 
export const ptoRequestLimiter = new RateLimiter(30, 15 * 60 * 1000);

// Cleanup every 5 minutes
setInterval(() => {
    candidateLimiter.cleanup();
    ptoRequestLimiter.cleanup();
}, 5 * 60 * 1000);
