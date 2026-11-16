import React, { useEffect, useState } from "react";
import PomiLoader from "@/components/PomiLoader";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import TrackingPreferences from "@/components/profile/TrackingPreferences";
import ProfileNameForm from "@/components/profile/ProfileNameForm";
import EmailBox from "@/components/profile/EmailBox";
import PasswordForm from "@/components/profile/PasswordForm";
import CausePreferences from "@/components/profile/CausePreferences";
import CurrencyPreference from "@/components/profile/CurrencyPreference";
import NotificationPreferences from "@/components/profile/NotificationPreferences";
import { DEFAULT_CURRENCY, currencyOf } from "@/lib/currency";
import {
  notificationUserFields,
  readNotificationPrefs,
} from "@/lib/notifications";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState([]);
  const [causes, setCauses] = useState([]);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [notifications, setNotifications] = useState(() =>
    readNotificationPrefs(null)
  );
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  // Clears the stored session and reloads, so the app opens as a new visitor.
  const handleLogout = () => {
    window.location.replace("/?clear_access_token=true");
  };

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        setUser(u || null);
        setTracking(u?.tracking_focus || []);
        setCauses(u?.charity_interests || []);
        setCurrency(currencyOf(u));
        setNotifications(readNotificationPrefs(u));
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        tracking_focus: tracking,
        charity_interests: causes,
        currency,
        ...notificationUserFields(notifications),
      });
      toast({
        title: "Preferences saved",
        description:
          "Your tracking areas, causes, currency and notifications are updated.",
      });
    } catch (e) {
      toast({
        title: "Couldn't save your preferences",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <PomiLoader />
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="font-heading text-xl font-semibold text-slate-700">
          We couldn't load your profile.
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          Back to my dashboard
        </Link>
      </div>
    );
  }

  const canSave = tracking.length > 0 && causes.length > 0 && !saving;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader maxWidth="max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my dashboard
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <h1 className="font-heading text-3xl font-semibold text-slate-800 sm:text-4xl">
          Your profile
        </h1>

        <div className="mt-8 space-y-6">
          <ProfileNameForm
            user={user}
            onSaved={(name) =>
              setUser((current) => ({ ...current, preferred_name: name }))
            }
          />
          <EmailBox email={user.email} />
          <PasswordForm user={user} />
          <TrackingPreferences selected={tracking} onChange={setTracking} />
          <CausePreferences selected={causes} onChange={setCauses} />
          <CurrencyPreference value={currency} onChange={setCurrency} />
          <NotificationPreferences
            preferences={notifications}
            onChange={setNotifications}
            tracking={tracking}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={!canSave}
          className="mt-8 w-full rounded-full bg-pomegranate-600 py-6 text-base hover:bg-pomegranate-700"
        >
          {saving ? "Saving…" : "Save preferences"}
        </Button>
        {!canSave && !saving && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Choose at least one tracking area and one cause to save.
          </p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="mx-auto mt-8 block text-sm font-medium text-slate-500 hover:text-pomegranate-600"
        >
          Log out
        </button>

        <Link
          to="/delete-account"
          className="mx-auto mt-4 block text-center text-sm font-medium text-slate-400 hover:text-destructive"
        >
          Delete my account
        </Link>
      </main>
    </div>
  );
}