import ADMIN from './admin';
import AUTH from './auth';
import CAMPUS_REGISTRAR from './campus-registrar';
import FACULTY from './faculty';
import GUEST from './guest';
import PROGRAM_CHAIR from './program-chair';

export const ROUTES = Object.freeze([
  ...AUTH,
  ...ADMIN,
  ...FACULTY,
  ...GUEST,
  ...PROGRAM_CHAIR,
  ...CAMPUS_REGISTRAR,
]);

export default ROUTES;
