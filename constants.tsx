
import React from 'react';
import { Droplet, Coffee, Beer, Soup, GlassWater } from 'lucide-react';

export const INTAKE_PRESETS = [
  { label: 'Small Glass', amount: 200, icon: <GlassWater className="w-5 h-5" /> },
  { label: 'Medium Glass', amount: 350, icon: <GlassWater className="w-6 h-6" /> },
  { label: 'Large Bottle', amount: 500, icon: <Droplet className="w-6 h-6" /> },
  { label: 'Large Bottle XL', amount: 750, icon: <Droplet className="w-7 h-7" /> },
];

export const OTHER_DRINKS = [
  { label: 'Coffee', amount: 250, icon: <Coffee className="w-5 h-5" />, hydratingFactor: 0.9 },
  { label: 'Tea', amount: 250, icon: <Soup className="w-5 h-5" />, hydratingFactor: 0.95 },
  { label: 'Juice', amount: 300, icon: <Beer className="w-5 h-5" />, hydratingFactor: 0.85 },
];

export const STORAGE_KEYS = {
  USER_PROFILE: 'hydrate_me_user_profile',
  INTAKE_LOGS: 'hydrate_me_intake_logs',
};
