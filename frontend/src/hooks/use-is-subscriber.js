import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

// Ad-free status comes from the server (getSubscriberStatus, derived from paid Base44Purchase
// records) — never from the User record, whose plan field the user can write themselves.
// Several components read the flag on the same page, so the lookup is shared per page load.
let statusPromise = null;

const fetchSubscriberStatus = () => {
  if (!statusPromise) {
    statusPromise = base44.functions
      .invoke("getSubscriberStatus", {})
      .then((res) => !!res.data?.subscriber)
      .catch(() => false);
  }
  return statusPromise;
};

// Whether the signed-in user is on an ad-free plan. null while the server answer is pending.
export default function useIsSubscriber() {
  const [subscriber, setSubscriber] = useState(null);

  useEffect(() => {
    let active = true;
    fetchSubscriberStatus().then((value) => {
      if (active) setSubscriber(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return subscriber;
}