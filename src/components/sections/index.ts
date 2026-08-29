/**
 * Barrel for the page sections (docs/UI_SPEC.md §6).
 *
 * A route composes a page out of these and passes each one its data from
 * `src/content/*`. No section fetches anything or hard-codes copy, which is what
 * keeps the CMS swap in docs/ARCHITECTURE.md §7 a data-layer change only — and
 * what makes this barrel the whole surface a page has to know about.
 *
 * Listed in the order a home page renders them, not alphabetically: the file is
 * also the site's running order.
 */

export { Hero } from './Hero';
export { PageHeader } from './PageHeader';
export { TrustStrip } from './TrustStrip';
export { JourneySection } from './JourneySection';
export { ServicesOverview } from './ServicesOverview';
export { InvestmentFactorsSection, PackagesSection } from './PackagesSection';
export { PortfolioPreview } from './PortfolioPreview';
export { PortfolioBrowser } from './PortfolioBrowser';
export { PortfolioTile } from './PortfolioTile';
export { BeforeAfterSection } from './BeforeAfterSection';
export { LooksSection } from './LooksSection';
export { ArtistsSection } from './ArtistsSection';
export { TestimonialsSection } from './TestimonialsSection';
export { AvailabilitySection } from './AvailabilitySection';
export { ConsultationSection } from './ConsultationSection';
export { WhatsAppBand } from './WhatsAppBand';
export { InstagramSection } from './InstagramSection';
export { FaqSection } from './FaqSection';
export { CtaBand } from './CtaBand';

/** Analytics wrappers, used inside pages rather than being sections themselves. */
export { TrackedCta } from './TrackedCta';
export { TrackInView } from './TrackInView';

export type { ArtistsSectionProps } from './ArtistsSection';
export type { AvailabilitySectionProps } from './AvailabilitySection';
export type { BeforeAfterSectionProps } from './BeforeAfterSection';
export type { ConsultationOption, ConsultationSectionProps } from './ConsultationSection';
export type { CtaBandCopy, CtaBandProps } from './CtaBand';
export type { FaqSectionProps } from './FaqSection';
export type { HeroCta, HeroProps } from './Hero';
export type { InstagramSectionProps } from './InstagramSection';
export type { JourneySectionProps } from './JourneySection';
export type { LooksSectionProps } from './LooksSection';
export type { PageHeaderProps } from './PageHeader';
export type {
  InvestmentFactor,
  InvestmentFactorsSectionProps,
  PackagesSectionProps,
} from './PackagesSection';
export type { PortfolioBrowserProps, PortfolioFilterGroup } from './PortfolioBrowser';
export type { PortfolioPreviewProps } from './PortfolioPreview';
export type { PortfolioTileProps } from './PortfolioTile';
export type { ServicesOverviewProps } from './ServicesOverview';
export type { TestimonialsSectionProps } from './TestimonialsSection';
export type { TrackInViewProps } from './TrackInView';
export type { CtaChannel, TrackedCtaProps } from './TrackedCta';
export type { TrustFact, TrustStripProps } from './TrustStrip';
export type { WhatsAppBandCopy, WhatsAppBandProps } from './WhatsAppBand';

export type { SectionCopy, SectionGround } from './types';
