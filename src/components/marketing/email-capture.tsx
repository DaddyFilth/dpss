'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call - in production, connect to your email service
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubscribed(true);
    setLoading(false);
    setEmail('');
  };

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-primary mb-2">🎉 You're in!</h3>
        <p className="text-sm text-gray-600">Check your inbox for 10% off your first order.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Get 10% Off Your First Order</h3>
      <p className="text-sm text-gray-600 mb-4">
        Join our newsletter for exclusive deals, trending products, and AI-predicted drops.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}
