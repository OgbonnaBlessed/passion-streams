import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { MODULE_ACCESS_RULES, AGE_LIMITS } from '../shared/constants';
import type { ModuleAccess, MaritalStatus } from '../shared/types';

export const requireModuleAccess = (module: ModuleAccess) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Age check
    if (req.user.age < AGE_LIMITS.MIN_AGE) {
      return res.status(403).json({ message: 'Must be 18 or older to access' });
    }

    // Passion Connect age check
    if (module === 'PASSION_CONNECT' && req.user.age < AGE_LIMITS.PASSION_CONNECT_MIN_AGE) {
      return res.status(403).json({ message: 'Must be 25 or older to access Passion Connect' });
    }

    // Marital status routing
    const allowedModules = MODULE_ACCESS_RULES[req.user.maritalStatus as MaritalStatus] || [];
    
    if (!allowedModules.includes(module)) {
      return res.status(403).json({ 
        message: `Access denied. Your marital status (${req.user.maritalStatus}) does not allow access to this module.` 
      });
    }

    next();
  };
};

