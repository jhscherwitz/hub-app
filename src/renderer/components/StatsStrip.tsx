import { formatTime, isSameDay, localIsoDate, nextEvent } from '../../shared/time';
import type { DashboardSnapshot } from '../../shared/types';
import { Icon, type IconName } from './Icon';

function Stat(props: { tone: string; icon: IconName; value: number; label: string; detail: string; meter?: number }) {
  const { tone, icon, value, label, detail, meter } = props;
  return (
    <div className={`stat stat-${tone}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-text">
        <span className="stat-label">{label}</span>
        <span className="stat-detail">{detail}</span>
      </span>
      <span className="stat-icon">
        <Icon name={icon} size={18} />
      </span>
      {meter !== undefined && (
        <span className="stat-meter" role="presentation">
          <span style={{ width: `${Math.round(meter * 100)}%` }} />
        </span>
      )}
    </div>
  );
}

/** Four big numbers that sum up the day at a glance. */
export function StatsStrip({ snapshot, now }: { snapshot: DashboardSnapshot; now: number }) {
  const today = snapshot.events.filter((e) => isSameDay(e.start, new Date(now)) && !e.allDay);
  const left = today.filter((e) => new Date(e.end).getTime() > now);
  const next = nextEvent(today, now);
  const replies = snapshot.emails.filter((e) => e.needsReply);
  const open = snapshot.tasks.filter((t) => !t.done);
  const dueToday = open.filter((t) => t.due && t.due.slice(0, 10) <= localIsoDate(new Date(now)));
  const done = snapshot.tasks.filter((t) => t.done);
  const names = replies.map((e) => e.from.name.split(' ')[0]);
  // How far through the day's meetings and the task list you are.
  const meetingsDone = today.length ? (today.length - left.length) / today.length : undefined;
  const tasksDone = snapshot.tasks.length ? done.length / snapshot.tasks.length : undefined;

  return (
    <div className="stats">
      <Stat
        tone="violet"
        icon="calendar"
        value={left.length}
        label={left.length === 1 ? 'Meeting left' : 'Meetings left'}
        detail={next ? `Next at ${formatTime(next.start)}` : 'Done for today'}
        meter={meetingsDone}
      />
      <Stat
        tone="pink"
        icon="mail"
        value={replies.length}
        label={replies.length === 1 ? 'Needs a reply' : 'Need a reply'}
        detail={names.length ? names.slice(0, 3).join(', ') : 'Inbox is calm'}
      />
      <Stat
        tone="green"
        icon="tasks"
        value={open.length}
        label={open.length === 1 ? 'Task open' : 'Tasks open'}
        detail={dueToday.length ? `${dueToday.length} due today` : 'Nothing due today'}
        meter={tasksDone}
      />
      <Stat
        tone="amber"
        icon="check"
        value={done.length}
        label="Done"
        detail={done.length ? 'Nice work' : 'Tick one off'}
      />
    </div>
  );
}
