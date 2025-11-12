export default function AuthBrandingSection() {
  return (
    <div className="hidden lg:flex lg:col-span-2 flex-col justify-center p-8 lg:p-12 bg-white/50 dark:bg-black/20 rounded-xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-neutral-950 dark:text-white tracking-tight text-4xl font-bold leading-tight">
          Find Your Next Customer on Reddit.
        </h1>
        <p className="text-neutral-950/80 dark:text-white/80 text-lg font-normal leading-relaxed">
          Rixly uses AI to monitor conversations and uncover qualified leads for your business,
          turning engagement into opportunity.
        </p>
        <div
          className="w-full mt-4 bg-center bg-no-repeat bg-cover aspect-square rounded-lg"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZkk1NM_u8VUzIEiId_e7I3riW_1ENUQGhnpnfLGJhYx2MpSPXKt4eU7HbFDQsfDF9d8QxheaS7SikBUJCsaAAxwEOtosZxdsR1JohNh4lOSnF1ChhUVZC4LkFOCZN6CpCZUGDFX4ZHDqyXRNvxpIVHzhp3ATc2dOR9SNO98r9Sk36OysbjaZSjHvG7VXMmFymlH1I0gTiSWFQncThgb8s6ye6CUUbmqS98_uGmQEITTacvepi8k9kd78DbDoMtFldXIvT8d_R7Ixs")`
          }}
          role="img"
          aria-label="Abstract purple and teal gradient waves representing data and AI"
        />
      </div>
    </div>
  );
}
