import ADMIN from './admin';
import AUTH from './auth';
import GUEST from './guest';
import PROGRAM_CHAIR from './program-chair';

export const ROUTES = Object.freeze([...AUTH, ...ADMIN, ...GUEST, ...PROGRAM_CHAIR]);

export default ROUTES;
