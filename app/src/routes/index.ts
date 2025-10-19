import ADMIN from './admin';
import AUTH from './auth';
import PROGRAM_CHAIR from './program-chair';

export const ROUTES = Object.freeze([...AUTH, ...ADMIN, ...PROGRAM_CHAIR]);

export default ROUTES;
