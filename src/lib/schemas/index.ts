/**
 * Barrel for the shared validation layer.
 *
 * The client imports from here and so does every route handler, which is the
 * mechanism that guarantees the two can never disagree about what a valid
 * submission looks like (docs/UX_SPEC.md §5, docs/SECURITY_SPEC.md §2).
 */

export {
  availabilityRequestSchema,
  availabilitySchema,
  DATE_FLEXIBILITY,
  isoDate,
  PACKAGE_PREFERENCES,
  type AvailabilityInput,
  type AvailabilityRequest,
} from './availability';

export {
  ARTIST_PREFERENCES,
  consultationRequestSchema,
  consultationSchema,
  HOW_HEARD_OPTIONS,
  WEDDING_FUNCTIONS,
  type ConsultationInput,
  type ConsultationRequest,
} from './consultation';

export {
  optionalMultiline,
  optionalText,
  sanitizeMultiline,
  sanitizeText,
  text,
} from './sanitize';
