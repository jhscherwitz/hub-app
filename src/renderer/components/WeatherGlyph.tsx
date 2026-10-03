import { useId } from 'react';

type Kind = 'sun' | 'moon' | 'partly' | 'cloud' | 'fog' | 'showers' | 'rain' | 'snow' | 'storm';

// The weather sources describe the sky with an emoji; draw each one as artwork instead.
const KIND: Record<string, Kind> = {
  '☀️': 'sun',
  '🌙': 'moon',
  '🌤️': 'partly',
  '⛅': 'partly',
  '☁️': 'cloud',
  '🌫️': 'fog',
  '🌦️': 'showers',
  '🌧️': 'rain',
  '🌨️': 'snow',
  '⛈️': 'storm',
};

const CLOUD = 'M20 50h26a10 10 0 0 0 1-20 14 14 0 0 0-27-3 11.5 11.5 0 0 0 0 23Z';

/** A glowing, drawn weather icon. Falls back to the emoji for anything unknown. */
export function WeatherGlyph({ icon, size = 72 }: { icon: string; size?: number }) {
  const id = useId();
  const kind = KIND[icon];
  if (!kind) return <span className="weather-emoji">{icon}</span>;

  const sun = `${id}-sun`;
  const cloud = `${id}-cloud`;
  const moon = `${id}-moon`;
  const hasSun = kind === 'sun' || kind === 'partly' || kind === 'showers';
  const hasCloud = kind !== 'sun' && kind !== 'moon';
  // With a cloud in front, the sun sits up and to the left.
  const sunAt = kind === 'sun' ? { x: 32, y: 32, r: 13 } : { x: 24, y: 24, r: 10 };

  return (
    <svg className="weather-glyph" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id={sun} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="55%" stopColor="#ffc14d" />
          <stop offset="100%" stopColor="#ff8a3d" />
        </radialGradient>
        <linearGradient id={cloud} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={kind === 'storm' || kind === 'rain' ? '#8f9bc4' : '#c9d2f0'} />
        </linearGradient>
        <linearGradient id={moon} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f1ff" />
          <stop offset="100%" stopColor="#a99cff" />
        </linearGradient>
      </defs>

      {hasSun && (
        <g className="glyph-sun">
          <g stroke="#ffc14d" strokeWidth="2.6" strokeLinecap="round" opacity="0.9">
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4;
              const r1 = sunAt.r + 4;
              const r2 = sunAt.r + 8;
              return (
                <line
                  key={i}
                  x1={sunAt.x + Math.cos(a) * r1}
                  y1={sunAt.y + Math.sin(a) * r1}
                  x2={sunAt.x + Math.cos(a) * r2}
                  y2={sunAt.y + Math.sin(a) * r2}
                />
              );
            })}
          </g>
          <circle cx={sunAt.x} cy={sunAt.y} r={sunAt.r} fill={`url(#${sun})`} />
        </g>
      )}

      {kind === 'moon' && <path d="M40 12a20 20 0 1 0 14 30A16 16 0 0 1 40 12Z" fill={`url(#${moon})`} />}

      {hasCloud && <path d={CLOUD} transform={kind === 'fog' ? 'translate(0 -6)' : undefined} fill={`url(#${cloud})`} />}

      {kind === 'fog' && (
        <g stroke="#c9d2f0" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          <line x1="14" y1="51" x2="50" y2="51" />
          <line x1="20" y1="58" x2="44" y2="58" />
        </g>
      )}

      {(kind === 'rain' || kind === 'showers' || kind === 'storm') && (
        <g className="glyph-rain" stroke="#6ad7ff" strokeWidth="3" strokeLinecap="round">
          <line x1="24" y1="55" x2="22" y2="61" />
          <line x1="33" y1="55" x2="31" y2="61" />
          <line x1="42" y1="55" x2="40" y2="61" />
        </g>
      )}

      {kind === 'storm' && <path d="M34 46l-6 9h6l-3 8 9-11h-6l3-6Z" fill="#ffd25a" />}

      {kind === 'snow' && (
        <g fill="#ffffff">
          <circle cx="23" cy="57" r="2.4" />
          <circle cx="32" cy="60" r="2.4" />
          <circle cx="41" cy="57" r="2.4" />
        </g>
      )}
    </svg>
  );
}
