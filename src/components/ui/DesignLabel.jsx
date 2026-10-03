/**
 * DesignLabel — visible divider between hero design variants.
 * Only for internal review; remove before production.
 */
export default function DesignLabel({ number, total }) {
  const isLast = number === total;

  return (
    <div style={{
      width: '100%',
      padding: '1.25rem 2.5rem',
      background: '#111',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 200,
    }}>
      <span style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: '#666',
        textTransform: 'uppercase',
      }}>
        Hero Design
      </span>

      <span style={{
        fontSize: '0.85rem',
        fontWeight: 800,
        letterSpacing: '0.05em',
        color: '#fff',
      }}>
        {number} / {total}
      </span>

      <span style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: isLast ? 'transparent' : '#666',
        textTransform: 'uppercase',
        userSelect: 'none',
      }}>
        {isLast ? '—' : '↓ scroll to compare'}
      </span>
    </div>
  );
}
