<template>
    <!-- HERO SECTION -->
    <section
        class="relative bg-gradient-to-br from-[#191e2b] to-[#161825] text-white min-h-[70vh] flex flex-col justify-center items-center py-24 px-4">
        <div class="max-w-2xl text-center">
            <h1 class="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                Build. Launch. Edit.<br />
                <span class="text-blue-400 drop-shadow-[0_0_8px_rgba(82,152,255,0.9)]">Tempest Sites</span>
            </h1>
            <p class="text-lg md:text-xl text-zinc-300 mb-8 font-medium">
                Instant websites, zero hassle. One click, real-time edits — hosting, domain, and a beautiful editor all
                included.<br>
                <span class="text-purple-300/90">Your site, your way. At 1AM or 1PM.</span>
            </p>
            <div class="flex justify-center gap-4">
                <button
                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-xl transition-all text-lg ring-2 ring-blue-400/40 hover:ring-blue-400">
                    Get Started
                </button>
                <button
                    class="bg-zinc-800/70 hover:bg-zinc-700 text-purple-200 font-medium px-8 py-3 rounded-2xl border border-purple-500/50 shadow-md transition-all text-lg">
                    See Pricing
                </button>
            </div>
        </div>
        <!-- Light Glow Effect -->
        <div
            class="pointer-events-none absolute inset-x-0 top-[60%] h-48 bg-gradient-to-t from-blue-700/20 via-purple-500/10 to-transparent blur-3xl">
        </div>
    </section>

    <!-- PRICING SECTION -->
    <section id="pricing" class="bg-[#191c24] py-20 px-4">
        <div class="max-w-5xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-4 text-white drop-shadow">Pick Your Launchpad</h2>
            <p class="text-center text-zinc-400 mb-12">Simple, fair pricing. All packages include 1 year free hosting +
                full access to our no-code editor.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- BASIC PACKAGE -->
                <div
                    class="bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:border-blue-500 transition-all">
                    <div class="text-3xl font-bold text-blue-400 mb-2">$500</div>
                    <div class="font-semibold text-zinc-200 mb-4">Starter Site</div>
                    <ul class="text-zinc-400 text-base flex-1 space-y-2 mb-8">
                        <li>✓ 3 custom pages</li>
                        <li>✓ Free [yoursite].mxn.au subdomain</li>
                        <li>✓ Mobile-optimized</li>
                        <li>✓ Real-time editor access</li>
                        <li>✓ 1yr hosting included</li>
                    </ul>
                    <button
                        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl transition-all">Choose</button>
                </div>
                <!-- PRO PACKAGE -->
                <div
                    class="bg-gradient-to-br from-blue-900/60 to-purple-900/70 border border-purple-700/60 rounded-2xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 hover:border-purple-400 transition-all">
                    <div class="text-3xl font-bold text-purple-300 mb-2">$1000</div>
                    <div class="font-semibold text-zinc-200 mb-4">Pro Site</div>
                    <ul class="text-zinc-400 text-base flex-1 space-y-2 mb-8">
                        <li>✓ 8 custom pages</li>
                        <li>✓ Custom domain connect</li>
                        <li>✓ Priority support</li>
                        <li>✓ Integrations (forms, email)</li>
                        <li>✓ All Starter features</li>
                    </ul>
                    <button
                        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl transition-all">Choose</button>
                </div>
                <!-- ULTIMATE PACKAGE -->
                <div
                    class="bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:border-blue-500 transition-all">
                    <div class="text-3xl font-bold text-blue-300 mb-2">$1500</div>
                    <div class="font-semibold text-zinc-200 mb-4">Ultimate Site</div>
                    <ul class="text-zinc-400 text-base flex-1 space-y-2 mb-8">
                        <li>✓ Unlimited pages</li>
                        <li>✓ E-commerce ready</li>
                        <li>✓ Premium integrations</li>
                        <li>✓ Personal onboarding</li>
                        <li>✓ All Pro features</li>
                    </ul>
                    <button
                        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl transition-all">Choose</button>
                </div>
            </div>
        </div>
    </section>

    <!-- REAL-TIME EDITING SECTION -->
    <section class="bg-gradient-to-br from-[#181a22] to-[#1a1333] py-20 px-4">
        <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
                <h3 class="text-3xl font-bold text-white mb-4">
                    Edit Instantly, Anywhere.
                </h3>
                <p class="text-lg text-zinc-300 mb-6">
                    Change text, images, or layout right from your phone or desktop — no coding, no waiting.
                </p>
                <ul class="text-zinc-400 space-y-2 mb-6">
                    <li>✔️ True mobile access — tweak your site in line at Woolies</li>
                    <li>✔️ Live preview as you type</li>
                    <li>✔️ Fix a typo at 1AM, see it go live instantly</li>
                </ul>
                <button
                    class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-7 py-3 rounded-2xl shadow-lg transition-all">
                    Try the Editor
                </button>
            </div>
            <div class="flex justify-center md:justify-end">
                <!-- Placeholder for screenshot/mockup -->
                <div
                    class="relative w-[340px] h-[420px] rounded-xl shadow-xl overflow-hidden border-2 border-blue-700/40 bg-zinc-800 flex items-center justify-center">
                    <span class="text-zinc-500 text-xl">[Editor Screenshot / Demo GIF]</span>
                </div>
            </div>
        </div>
    </section>

    <!-- SUBSCRIPTION EXPLAINER SECTION -->
    <section class="bg-[#191c24] py-20 px-4">
        <div class="max-w-3xl mx-auto text-center">
            <h3 class="text-3xl font-bold text-white mb-4">$15/month after your first year</h3>
            <p class="text-lg text-zinc-300 mb-6">
                Keep your site live, secure, and fully editable for just the price of a Netflix sub. No hidden fees, no
                surprises. <span class="text-purple-400 font-semibold">Cancel any time, keep your content.</span>
            </p>
            <div class="flex flex-col md:flex-row justify-center items-center gap-6 mt-6">
                <div
                    class="bg-zinc-800 border border-zinc-700/60 rounded-xl px-8 py-6 text-zinc-200 font-medium flex-1">
                    <span class="text-blue-400 font-bold">All features unlocked</span><br>
                    Hosting, custom domain, no-code editing — always included.
                </div>
                <div
                    class="bg-zinc-800 border border-zinc-700/60 rounded-xl px-8 py-6 text-zinc-200 font-medium flex-1">
                    <span class="text-purple-400 font-bold">1 year FREE</span><br>
                    Included with every launch package.
                </div>
            </div>
        </div>
    </section>

    <!-- CLOSING CTA -->
    <section class="bg-gradient-to-tr from-[#161825] to-[#1c2342] py-20 px-4 text-center">
        <div class="max-w-xl mx-auto">
            <h3 class="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to build your <span class="text-blue-400">dream site</span>?
            </h3>
            <p class="text-lg text-zinc-300 mb-8">Instant launch. Total control. Your site, your way.<br>Get started
                with Tempest Sites in minutes.</p>
            <button
                class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-2xl text-xl shadow-2xl ring-2 ring-blue-400/40 hover:ring-purple-400 transition-all">
                Get Started Now
            </button>
        </div>
    </section>
</template>

<script setup>
// No additional logic needed for static landing page.
// Slot in router navigation or emit events to wire up buttons as needed.
</script>