interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlightWord?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  headingId?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  highlightWord,
  subtitle,
  align = 'left',
  theme = 'light',
  headingId,
}: SectionHeadingProps) {
  const classes = [
    'section-heading',
    align === 'center' ? 'section-heading--center' : '',
    theme === 'dark' ? 'section-heading--dark' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {eyebrow ? <span className="section-heading__eyebrow">{eyebrow}</span> : null}
      <h2 id={headingId} className="section-heading__title">
        {title}{' '}
        {highlightWord ? (
          <span className="section-heading__highlight">{highlightWord}</span>
        ) : null}
      </h2>
      {subtitle ? <p className="section-heading__subtitle">{subtitle}</p> : null}
    </div>
  );
}
