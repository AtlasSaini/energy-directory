interface LogoProps {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CONFIG = {
  sm: { barHeight: 3, barWidths: [22, 15, 19], barGap: 3, fontSize: 15, gap: 8 },
  md: { barHeight: 4, barWidths: [36, 24, 30], barGap: 5, fontSize: 24, gap: 12 },
  lg: { barHeight: 7, barWidths: [44, 29, 37], barGap: 6, fontSize: 44, gap: 18 },
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const config = SIZE_CONFIG[size]
  const energyColor = variant === 'light' ? '#FFFFFF' : '#1D1D1F'
  const accentColor = '#E8590C'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: config.gap,
        fontWeight: 700,
        letterSpacing: '-0.03em',
        fontSize: config.fontSize,
        lineHeight: 1,
      }}
    >
      {/* Bars icon */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: config.barGap, justifyContent: 'center' }}>
        {config.barWidths.map((width, i) => (
          <div
            key={i}
            style={{
              width,
              height: config.barHeight,
              backgroundColor: accentColor,
              borderRadius: config.barHeight / 2,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <span style={{ color: energyColor }}>Energy</span>
        <span style={{ color: accentColor }}>Directory</span>
      </div>
    </div>
  )
}
