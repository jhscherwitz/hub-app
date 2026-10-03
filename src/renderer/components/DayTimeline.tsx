import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../../shared/time';
import { dayTimeline, shortHour } from '../../shared/timeline';
import type { CalendarEvent } from '../../shared/types';

/** Blocks narrower than this (pixels) are too small to label; hover shows the title. */
const MIN_LABEL_PX = 60;

/** Today at a glance: every meeting as a block on one strip, with a glowing "now" line. */
export function DayTimeline({ events, now }: { events: CalendarEvent[]; now: number }) {
  const t = dayTimeline(events, now);
  const track = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setTrackWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="day-timeline" style={{ ['--lanes' as string]: t.lanes }}>
      <div className="day-track" ref={track}>
        {t.nowAt !== null && <span className="day-gone" style={{ width: `${t.nowAt}%` }} />}
        {t.items.map((item) => (
          <span
            key={item.event.id}
            className={`day-event day-${item.state}`}
            style={{ left: `${item.left}%`, width: `${item.width}%`, ['--lane' as string]: item.lane }}
            title={`${item.event.title} · ${formatTime(item.event.start)}–${formatTime(item.event.end)}`}
          >
            {(item.width / 100) * trackWidth >= MIN_LABEL_PX && <span className="day-event-title">{item.event.title}</span>}
          </span>
        ))}
        {t.nowAt !== null && <span className="day-now" style={{ left: `${t.nowAt}%` }} />}
      </div>
      <div className="day-ticks" aria-hidden="true">
        {t.ticks.map((tick) => (
          <span key={tick.at} style={{ left: `${tick.at}%` }}>
            {shortHour(tick.hour)}
          </span>
        ))}
      </div>
    </div>
  );
}
