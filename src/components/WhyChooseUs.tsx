export default function WhyChooseUs() {
  const points = [
    {
      icon: "verified",
      title: "Handpicked Luxury",
      description: "Every hotel on our platform undergoes a rigorous 50-point inspection.",
    },
    {
      icon: "support_agent",
      title: "24/7 Lifestyle Concierge",
      description: "Dedicated specialists to assist with reservations, transport, and requests.",
    },
    {
      icon: "security",
      title: "Secure & Private",
      description: "Institutional-grade security for your bookings and personal data.",
    },
  ];

  return (
    <section className="py-section-gap-lg max-w-container-max mx-auto px-gutter">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="font-display-lg text-display-lg text-primary mb-4">
          Why Choose Us
        </h2>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          Experience the difference that true dedication to luxury and service makes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="rounded-lg overflow-hidden h-[500px]">
            <img
              className="w-full h-full object-cover"
              alt="Concierge assisting a guest"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhMuFX5EMO1gWceUbnHXBRM-hozjEhx43pX3V0pA2aQWu_hePF9kh0nyBFLucZLxOIt7EilrF4mbuPsiubnIB1g3mSuqhmyeDADQiRwr7SPkKd_XGijhFe1gx_lt007SonUdcjQmSJXCmxo7PI0OC0b4zCpKNs_bhKCz-oiyYiuATHmwd4QgoJjwdtoyXBGKptBXkfeCaHpeUTCg7SIQfRH0dH_gq9tKj9dyK3Dj-lznx8EjfnlRzT"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 hidden md:block glass-panel p-8 rounded-lg border border-outline-variant shadow-2xl max-w-xs">
            <p className="font-display-lg text-primary mb-2">15+</p>
            <p className="font-body-md text-on-surface-variant">
              Years of delivering uncompromising luxury experiences in the UAE.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">The Dubai Lodgings Standard</h3>
            <p className="text-on-surface-variant text-body-lg">
              We don&apos;t just book rooms; we curate experiences. Our portfolio represents the pinnacle of
              hospitality, where every detail is engineered for your comfort.
            </p>
          </div>
          <div className="space-y-6">
            {points.map((point) => (
              <div key={point.title} className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-secondary-container">{point.icon}</span>
                </div>
                <div>
                  <h6 className="font-body-md font-bold text-primary">{point.title}</h6>
                  <p className="text-on-surface-variant text-body-sm">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}