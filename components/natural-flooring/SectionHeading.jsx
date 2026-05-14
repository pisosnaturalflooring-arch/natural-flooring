import styles from "./NaturalFlooringPage.module.css";

export default function SectionHeading({
  label,
  title,
  side,
  inverse = false,
  reveal = false,
}) {
  const sectionClass = inverse ? styles.sectionHeadingInverse : styles.sectionHeading;
  const labelClass = inverse ? styles.sectionLabelInverse : styles.sectionLabel;
  const titleClass = inverse ? styles.sectionTitleInverse : styles.sectionTitle;
  const revealAttrs = reveal
    ? { "data-reveal": true, className: styles.revealUp, style: { "--delay": "0s" } }
    : {};

  return (
    <div className={sectionClass}>
      <div {...revealAttrs}>
        <p className={labelClass}>{label}</p>
        <h2 className={titleClass}>{title}</h2>
      </div>
      {side ? <div>{side}</div> : null}
    </div>
  );
}
