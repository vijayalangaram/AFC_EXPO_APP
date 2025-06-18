import api from './axios';
import { ENDPOINTS } from '../config/constants';

export const fetchAccountSummary = () => api.get(ENDPOINTS.ACCOUNT_SUMMARY);
