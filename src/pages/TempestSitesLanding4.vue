<template>
    <div class="min-h-screen bg-black text-white overflow-hidden relative">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div
                class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000">
            </div>
            <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <!-- Navigation -->
        <nav class="relative z-50 p-6 flex justify-between items-center">
            <div class="text-2xl font-bold">
                <span class="text-white">Tempest</span>
                <span class="text-cyan-400 ml-1">Sites</span>
            </div>
            <button
                class="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105">
                Get Started
            </button>
        </nav>

        <!-- Hero Section -->
        <section class="relative z-10 px-6 py-20 text-center">
            <div class="max-w-6xl mx-auto">
                <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    <span class="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                        Lightning-Fast
                    </span>
                    <br>
                    <span class="text-white">Websites</span>
                    <span class="text-cyan-400 ml-4">On Demand</span>
                </h1>

                <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
                    No fluff, no delay. Just modern, blazing-fast, responsive sites with built-in hosting
                    and a no-code editor that puts you in complete control.
                </p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <button
                        class="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-lg font-bold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25">
                        Get Your Site Live Now
                    </button>
                    <button
                        class="px-8 py-4 border-2 border-gray-600 rounded-lg text-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300">
                        See Pricing
                    </button>
                </div>

                <!-- Real-time badge -->
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-cyan-500/30 rounded-full backdrop-blur-sm">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-sm font-medium text-gray-300">Real-time editing • Live updates • Zero
                        downtime</span>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="relative z-10 px-6 py-20">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-4xl md:text-5xl font-bold text-center mb-16">
                    <span class="text-white">Built for</span>
                    <span class="text-cyan-400 ml-2">Speed</span>
                </h2>

                <div class="grid md:grid-cols-3 gap-8">
                    <div
                        class="group p-8 bg-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-4">Instant Live Updates</h3>
                        <p class="text-gray-400">Edit at 1am on your phone? Changes go live instantly. No waiting, no
                            publishing delays, no downtime.</p>
                    </div>

                    <div
                        class="group p-8 bg-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-4">Mobile-First Control</h3>
                        <p class="text-gray-400">Full no-code editor optimized for mobile. Manage your entire site from
                            anywhere, anytime.</p>
                    </div>

                    <div
                        class="group p-8 bg-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-4">Everything Included</h3>
                        <p class="text-gray-400">Hosting, domain, SSL, backups, and premium support. We handle the tech,
                            you focus on your business.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section class="relative z-10 px-6 py-20">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-4xl md:text-5xl font-bold text-center mb-4">
                    <span class="text-white">Simple</span>
                    <span class="text-cyan-400 ml-2">Pricing</span>
                </h2>
                <p class="text-center text-gray-400 mb-16 text-lg">Choose your tier. Get your site. Own your future.</p>

                <div class="grid md:grid-cols-3 gap-8 mb-16">
                    <!-- Spark Tier -->
                    <div
                        class="relative p-8 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
                        <div class="text-center mb-8">
                            <h3 class="text-2xl font-bold mb-2">Spark</h3>
                            <div class="text-4xl font-black text-cyan-400 mb-2">$500</div>
                            <p class="text-gray-400">Perfect for startups</p>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">5-page modern website</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">1 year hosting included</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">Full no-code editor access</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">Subdomain included</span>
                            </li>
                        </ul>
                        <button
                            class="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-300">
                            Get Spark
                        </button>
                    </div>

                    <!-- Storm Tier (Popular) -->
                    <div
                        class="relative p-8 bg-gradient-to-b from-cyan-900/20 to-blue-900/20 border-2 border-cyan-500 rounded-2xl backdrop-blur-sm transform scale-105">
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span
                                class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                MOST POPULAR
                            </span>
                        </div>
                        <div class="text-center mb-8">
                            <h3 class="text-2xl font-bold mb-2">Storm</h3>
                            <div class="text-4xl font-black text-cyan-400 mb-2">$1,000</div>
                            <p class="text-gray-400">For growing businesses</p>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">10-page premium website</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">1 year hosting included</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">Advanced integrations</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">Custom domain setup</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">Priority support</span>
                            </li>
                        </ul>
                        <button
                            class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
                            Get Storm
                        </button>
                    </div>

                    <!-- Thunder Tier -->
                    <div
                        class="relative p-8 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                        <div class="text-center mb-8">
                            <h3 class="text-2xl font-bold mb-2">Thunder</h3>
                            <div class="text-4xl font-black text-purple-400 mb-2">$1,500</div>
                            <p class="text-gray-400">For enterprises</p>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">Unlimited pages</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">1 year hosting included</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">E-commerce ready</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">Custom integrations</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-gray-300">White-glove onboarding</span>
                            </li>
                        </ul>
                        <button
                            class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                            Get Thunder
                        </button>
                    </div>
                </div>

                <!-- Subscription Info -->
                <div class="text-center p-8 bg-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm">
                    <h3 class="text-2xl font-bold mb-4">After Your First Year</h3>
                    <p class="text-gray-400 mb-4 text-lg">
                        Keep your site live and maintain full editor access for just <span
                            class="text-cyan-400 font-bold">$15/month</span>.
                        Cancel anytime, export anytime. You own your content.
                    </p>
                    <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                        <span>✓ Continued hosting</span>
                        <span>✓ No-code editor access</span>
                        <span>✓ Real-time updates</span>
                        <span>✓ 24/7 support</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA -->
        <section class="relative z-10 px-6 py-20 text-center">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-4xl md:text-6xl font-bold mb-6">
                    <span class="text-white">Ready to</span>
                    <span
                        class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ml-3">Launch?</span>
                </h2>
                <p class="text-xl text-gray-300 mb-8 font-light">
                    Join the companies who choose speed, control, and reliability. Your site can be live tomorrow.
                </p>
                <button
                    class="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
                    Get Your Site Live Now
                </button>
                <p class="text-sm text-gray-500 mt-4">No contracts • No hidden fees • Launch in 24-48 hours</p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="relative z-10 px-6 py-12 border-t border-gray-800">
            <div class="max-w-6xl mx-auto text-center">
                <div class="text-2xl font-bold mb-4">
                    <span class="text-white">Tempest</span>
                    <span class="text-cyan-400 ml-1">Sites</span>
                </div>
                <p class="text-gray-500 mb-6">Part of Tempest Studios</p>
                <div class="flex justify-center space-x-8 text-sm text-gray-400">
                    <a href="#" class="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                    <a href="#" class="hover:text-cyan-400 transition-colors">Terms of Service</a>
                    <a href="#" class="hover:text-cyan-400 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
    isVisible.value = true
})
</script>

<style scoped>
/* Custom animations for enhanced visual appeal */
.animate-float {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }
}

/* Glow effects for interactive elements */
.hover\:shadow-cyan-500\/25:hover {
    box-shadow: 0 25px 50px -12px rgba(6, 182, 212, 0.25);
}

.hover\:shadow-purple-500\/25:hover {
    box-shadow: 0 25px 50px -12px rgba(168, 85, 247, 0.25);
}

.hover\:shadow-green-500\/25:hover {
    box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.25);
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}

/* Background grain texture */
.bg-black::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>