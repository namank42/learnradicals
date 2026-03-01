import { redirect } from "next/navigation";
import Stripe from "stripe";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Purchase Complete — Learn Radicals",
  robots: { index: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    redirect("/");
  }

  const paid = session.payment_status === "paid";
  const email = session.customer_details?.email;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        {paid ? (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red/10">
              <svg
                className="h-8 w-8 text-red"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">
              You&rsquo;re in!
            </h1>
            <p className="mt-3 text-gray">
              Your copy of Learn Radicals is ready to download.
            </p>
            <a
              href={`/api/download?session_id=${session_id}`}
              className="cta-button mt-8 inline-block bg-red text-white px-10 py-4 rounded-2xl text-lg font-medium"
            >
              Download PDF &darr;
            </a>
            {email && (
              <p className="mt-6 text-sm text-gray">
                A backup download link has been sent to{" "}
                <span className="font-medium text-ink">{email}</span>
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">
              Payment pending
            </h1>
            <p className="mt-3 text-gray">
              Your payment is being processed. You&rsquo;ll receive an email
              with your download link once it&rsquo;s confirmed.
            </p>
          </>
        )}
        <a
          href="/"
          className="mt-8 inline-block text-sm text-gray hover:text-ink transition-colors"
        >
          &larr; Back to home
        </a>
      </div>
    </main>
  );
}
