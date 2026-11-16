import React from "react";
import { Bell, Mail, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { CHANNELS, visibleTopics } from "@/lib/notifications";

const ICONS = { email: Mail, push: Smartphone };

function ChannelToggle({ channel, checked, onChange, topicLabel }) {
  const Icon = ICONS[channel.key];
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition ${
        checked
          ? "border-pomegranate-300 bg-pomegranate-50"
          : "border-slate-200 hover:border-pomegranate-200"
      }`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${
          checked ? "text-pomegranate-600" : "text-slate-400"
        }`}
      />
      <span
        className={`text-xs ${checked ? "text-pomegranate-700" : "text-slate-500"}`}
      >
        {channel.label}
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        aria-label={`${topicLabel} by ${channel.label}`}
        className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3 data-[state=checked]:bg-pomegranate-600"
      />
    </div>
  );
}

// Every tracker has its own email and push switch, so the reminders someone
// gets follow what they actually track.
export default function NotificationPreferences({
  preferences,
  onChange,
  tracking = [],
}) {
  const topics = visibleTopics(tracking);

  const set = (topicKey, channelKey, checked) =>
    onChange({
      ...preferences,
      [topicKey]: { ...preferences[topicKey], [channelKey]: checked },
    });

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-pomegranate-400" />
        <h2 className="font-heading text-lg font-semibold text-slate-800">
          Notifications
        </h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Choose what Pomi sends you, and how — separately for each thing you
        track.
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
        {topics.map((topic) => (
          <div
            key={topic.key}
            className="flex flex-col gap-2.5 border-b border-slate-100 px-4 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">
                {topic.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{topic.desc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {CHANNELS.map((channel) => (
                <ChannelToggle
                  key={channel.key}
                  channel={channel}
                  topicLabel={topic.label}
                  checked={Boolean(preferences[topic.key]?.[channel.key])}
                  onChange={(checked) => set(topic.key, channel.key, checked)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Push notifications arrive in the Pomi mobile app.
      </p>
    </section>
  );
}