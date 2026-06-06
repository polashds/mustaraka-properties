export default function HomePage() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-brand-bg">
      {/* Subtle gold radial glow from top-center */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,rgba(201,168,76,0.09)_0%,transparent_65%)]" />
      {/* Fine horizontal grid lines for luxury texture */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(201,168,76,0.025)_0px,rgba(201,168,76,0.025)_1px,transparent_1px,transparent_72px)]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 text-center lg:px-8">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gold/40" />
          <p className="font-body text-xs font-medium tracking-[0.35em] text-gold uppercase">
            Premium Real Estate · Bangladesh
          </p>
          <span className="h-px w-10 bg-gold/40" />
        </div>

        {/* Headline */}
        <h1 className="font-heading font-light text-brand-text leading-[1.08] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          Discover Your{" "}
          <span className="italic text-gold">Perfect</span>
          <br />
          Property in Bangladesh
        </h1>

        {/* Sub-line */}
        <p className="mx-auto mt-8 max-w-2xl font-body text-base text-brand-muted md:text-lg leading-relaxed">
          Curated apartments, houses, and commercial spaces in Dhaka,
          Chittagong, Sylhet &amp; Rajshahi — tailored to your lifestyle.
        </p>

        {/* Search bar — visual only, wired up in Phase 1 */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-col overflow-hidden border border-gold/20 bg-brand-surface shadow-[0_8px_48px_rgba(0,0,0,0.6)] sm:flex-row">
          {/* Property type */}
          <div className="flex flex-1 items-stretch border-b border-gold/20 sm:border-b-0 sm:border-r">
            <select
              aria-label="Property type"
              className="w-full bg-transparent px-5 py-4 text-sm text-brand-muted cursor-pointer focus:outline-none"
            >
              <option className="bg-brand-surface" value="">
                Property Type
              </option>
              <option className="bg-brand-surface" value="apartment">
                Apartment
              </option>
              <option className="bg-brand-surface" value="house">
                House
              </option>
              <option className="bg-brand-surface" value="commercial">
                Commercial
              </option>
              <option className="bg-brand-surface" value="land">
                Land
              </option>
            </select>
          </div>

          {/* City */}
          <div className="flex flex-1 items-stretch border-b border-gold/20 sm:border-b-0 sm:border-r">
            <select
              aria-label="City"
              className="w-full bg-transparent px-5 py-4 text-sm text-brand-muted cursor-pointer focus:outline-none"
            >
              <option className="bg-brand-surface" value="">
                Select City
              </option>
              <option className="bg-brand-surface" value="dhaka">
                Dhaka
              </option>
              <option className="bg-brand-surface" value="chittagong">
                Chittagong
              </option>
              <option className="bg-brand-surface" value="sylhet">
                Sylhet
              </option>
              <option className="bg-brand-surface" value="rajshahi">
                Rajshahi
              </option>
            </select>
          </div>

          {/* Search button */}
          <button
            type="button"
            className="px-8 py-4 bg-gold font-body text-sm font-medium tracking-[0.12em] text-brand-bg uppercase transition-colors duration-200 hover:bg-gold-light"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
