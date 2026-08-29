import { Container, Rule, Section } from '@/components/primitives';
import { PageHeader } from '@/components/sections';
import { LAST_REVIEWED, privacySections } from '@/content/legal';
import {
  licensedCredits,
  photographersByName,
  photographyCredits,
  photographyLicence,
  studioCredits,
} from '@/content/photography-credits';
import { disclosures } from '@/content/site-copy';
import { breadcrumbNode, graph } from '@/lib/jsonld';
import { pageMetadata, trail } from '@/lib/seo';

import type { LegalSection } from '@/types/content';
import type { Metadata } from 'next';

/**
 * Privacy (docs/SECURITY_SPEC.md §9).
 *
 * Every sentence here is checkable against the code rather than borrowed from a
 * template: two route handlers, in-memory repositories, one structured log line
 * per request, a per-process salted hash for rate limiting, and no outbound call
 * of any kind. A page that claimed more processing than the build performs would
 * be as wrong as one that claimed less.
 *
 * The photography credits live on this page because provenance is a privacy-
 * adjacent fact — it is the answer to "whose images are these, and is anything
 * being fetched from someone else's server when I load the page". Both answers
 * are here: named photographers, and no, every file is self-hosted.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Privacy',
  description:
    'What this site collects, where it goes, what is logged, and the photography credits. No cookies, no analytics, no third-party requests, and submissions held only in server memory.',
  path: '/privacy',
});

const CRUMBS = trail({ label: 'Privacy', href: '/privacy' });

/**
 * `privacySections` is authored `as const`, which narrows each element to its own
 * literal shape — so the sections without bullets have no `bullets` property at
 * all. Widening to the interface is what lets one loop render both shapes.
 */
const SECTIONS: readonly LegalSection[] = privacySections;

const REVIEWED = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${LAST_REVIEWED}T00:00:00Z`));

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="Privacy"
        heading="What this site does with what you type"
        lead="Written to describe this build rather than to look like a legal page. Everything below is checkable against the source: two form handlers, no database, no cookies, and no third-party request from any page."
        meta={[`Last reviewed ${REVIEWED}`, 'No cookies set', 'No analytics vendor connected']}
      />

      <Section tone="ivory">
        <Container width="narrow" className="flex flex-col gap-12">
          {SECTIONS.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2 className="text-display-sm">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-body-md leading-relaxed text-espresso-700"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="flex flex-col gap-2 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="list-disc text-body-md text-espresso-700">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </Container>
      </Section>

      <Section tone="ivory-alt" id="photography">
        <Container width="narrow" className="flex flex-col gap-6">
          <h2 className="text-display-sm">Photography credits</h2>
          <p className="text-body-md leading-relaxed text-espresso-700">
            The Bridal Atelier is a demonstration brand and has no client photography of its own.
            Almost every photograph here is a licensed editorial image by a named photographer; the
            {' '}
            {studioCredits.length} before/after frames are matched originals supplied with the
            project brief. Both kinds are downloaded once and served from this domain — nothing is
            hot-linked, so no third-party origin is contacted when a page loads. The three remaining
            image assets are generated vector artwork.
          </p>
          <p className="text-body-sm text-espresso-700">{photographyLicence}</p>

          <Rule tone="sand" />

          <div className="flex flex-col gap-3">
            <h3 className="text-body-lg font-medium text-espresso-900">
              {photographersByName.length} photographers, {licensedCredits.length} licensed
              photographs
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {photographersByName.map((entry) => (
                <li key={entry.name} className="text-body-sm text-espresso-700">
                  {entry.name}
                  <span className="text-stone-500">
                    {entry.count > 1 ? ` (${entry.count})` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-body-lg font-medium text-espresso-900">
              {studioCredits.length} studio originals
            </h3>
            <p className="text-body-sm leading-relaxed text-espresso-700">
              The before/after comparison needs one subject photographed twice under one lighting
              setup, which no stock library can supply — two different faces in a slider would claim
              a transformation that never happened. Those {studioCredits.length} frames were supplied
              with the project brief for use in this build. They are not stock images and are not
              covered by the licence above.
            </p>
          </div>

          <Rule tone="sand" />

          <details className="group flex flex-col gap-3">
            <summary className="inline-flex min-h-11 cursor-pointer items-center text-body-sm font-medium text-espresso-900">
              Every file, with its source
            </summary>
            <ul className="mt-4 flex flex-col gap-3">
              {photographyCredits.map((row) => (
                <li key={row.id} className="flex flex-col gap-0.5">
                  <span className="text-body-sm text-espresso-800">
                    <code className="font-mono text-body-xs text-stone-500">{row.file}</code> —{' '}
                    {row.subject}
                  </span>
                  <span className="text-body-xs text-stone-500">
                    {row.credit.photographer} ·{' '}
                    {row.credit.page ? (
                      <a
                        href={row.credit.page}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="underline-draw text-espresso-700"
                      >
                        {row.credit.source}
                      </a>
                    ) : (
                      row.credit.source
                    )}{' '}
                    · {row.width}×{row.height}
                  </span>
                </li>
              ))}
            </ul>
          </details>

          <p className="text-body-xs text-stone-500">
            To replace any of these with real studio photography, drop a JPEG at the same path and
            dimensions and remove that id from the fetch source list. No component changes are
            required.
          </p>
        </Container>
      </Section>

      <Section tone="inset" spacing="tight">
        <Container width="narrow">
          <p className="text-body-sm text-espresso-700">{disclosures.demonstrationSite}</p>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: graph(breadcrumbNode(CRUMBS)) }}
      />
    </>
  );
}
