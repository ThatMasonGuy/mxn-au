<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden">
            <div
                class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse">
            </div>
            <div
                class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000">
            </div>
            <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500">
            </div>
        </div>

        <!-- Navigation -->
        <nav class="relative z-10 p-6 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div
                    class="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold text-sm">T</span>
                </div>
                <span
                    class="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Tempest Sites
                </span>
            </div>
            <button
                class="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                Get Started
            </button>
        </nav>

        <!-- Hero Section -->
        <section class="relative z-10 px-6 py-20 text-center">
            <div class="max-w-6xl mx-auto">
                <div
                    class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-sm">Real-time editing • Always live</span>
                </div>

                <h1 class="text-5xl md:text-7xl font-bold mb-6">
                    <span
                        class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Build Websites
                    </span>
                    <br />
                    <span class="text-white">That Never Sleep</span>
                </h1>

                <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Professional websites built on demand with real-time editing.
                    Make changes at 1AM on your phone and watch them go live instantly.
                </p>

                <div class="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
                    <button
                        class="group bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                        <span>Start Building</span>
                        <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        class="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                        View Packages
                    </button>
                </div>

                <!-- Feature highlights -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div
                        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Instant Live Updates</h3>
                        <p class="text-gray-400">Edit your site anywhere, anytime. Changes go live immediately without
                            delays.</p>
                    </div>

                    <div
                        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Globe class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Custom Domain Ready</h3>
                        <p class="text-gray-400">Get [your-site].mxn.au or connect your own domain. Professional from
                            day one.</p>
                    </div>

                    <div
                        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Smartphone class="w-6 h-6" />
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Mobile-First Editor</h3>
                        <p class="text-gray-400">Edit on any device. Our no-code editor works perfectly on phones and
                            tablets.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section class="relative z-10 px-6 py-20">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6">
                        <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Choose Your Package
                        </span>
                    </h2>
                    <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                        All packages include 1 year free hosting and lifetime access to our real-time editor
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <!-- Starter Package -->
                    <div
                        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500">
                        </div>
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-2xl font-bold">Starter</h3>
                            <div
                                class="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                                <Rocket class="w-6 h-6" />
                            </div>
                        </div>
                        <div class="mb-6">
                            <span class="text-4xl font-bold">$500</span>
                            <span class="text-gray-400 ml-2">one-time</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Professional single-page design</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Mobile-responsive layout</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Contact form integration</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Basic SEO optimization</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">1 year free hosting</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Real-time editor access</span>
                            </li>
                        </ul>
                        <button
                            class="w-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                            Get Started
                        </button>
                    </div>

                    <!-- Business Package -->
                    <div
                        class="bg-white/5 backdrop-blur-md border-2 border-purple-500 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden transform scale-105">
                        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500">
                        </div>
                        <div
                            class="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Popular
                        </div>
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-2xl font-bold">Business</h3>
                            <div
                                class="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                                <Code class="w-6 h-6" />
                            </div>
                        </div>
                        <div class="mb-6">
                            <span class="text-4xl font-bold">$1,000</span>
                            <span class="text-gray-400 ml-2">one-time</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Multi-page website (up to 5 pages)</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Advanced animations & interactions</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">E-commerce integration</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Custom contact forms</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Advanced SEO optimization</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">1 year free hosting</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Priority support</span>
                            </li>
                        </ul>
                        <button
                            class="w-full bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                            Choose Business
                        </button>
                    </div>

                    <!-- Premium Package -->
                    <div
                        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-red-500"></div>
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-2xl font-bold">Premium</h3>
                            <div
                                class="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl flex items-center justify-center">
                                <Palette class="w-6 h-6" />
                            </div>
                        </div>
                        <div class="mb-6">
                            <span class="text-4xl font-bold">$1,500</span>
                            <span class="text-gray-400 ml-2">one-time</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Unlimited pages</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Custom design & branding</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Advanced e-commerce features</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Database integration</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Custom functionality</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">1 year free hosting</span>
                            </li>
                            <li class="flex items-center space-x-3">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span class="text-gray-300">Dedicated support</span>
                            </li>
                        </ul>
                        <button
                            class="w-full bg-gradient-to-r from-pink-500 to-red-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105">
                            Go Premium
                        </button>
                    </div>
                </div>

                <!-- Hosting Info -->
                <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                    <h3 class="text-2xl font-bold mb-4">Ongoing Hosting</h3>
                    <p class="text-gray-300 mb-4">
                        After your first year, keep your site live for just <span
                            class="text-cyan-400 font-semibold">$15/month</span>
                    </p>
                    <div class="flex items-center justify-center space-x-6 text-sm text-gray-400">
                        <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>99.9% Uptime</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <span>Fast Global CDN</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>SSL Included</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Real-time Demo Section -->
        <section class="relative z-10 px-6 py-20">
            <div class="max-w-6xl mx-auto text-center">
                <h2 class="text-4xl md:text-5xl font-bold mb-6">
                    <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Edit Live, See Changes Instantly
                    </span>
                </h2>
                <p class="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                    Our no-code editor works in real-time. Make a change and watch it appear instantly for all visitors.
                </p>

                <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
                    <div class="flex items-center justify-center space-x-8 mb-8">
                        <div class="text-center">
                            <div
                                class="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <Smartphone class="w-8 h-8" />
                            </div>
                            <p class="text-gray-300">Edit on Mobile</p>
                        </div>

                        <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                            <div class="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-400"></div>
                        </div>

                        <div class="text-center">
                            <div
                                class="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <Globe class="w-8 h-8" />
                            </div>
                            <p class="text-gray-300">Live for Everyone</p>
                        </div>
                    </div>

                    <div class="flex items-center justify-center space-x-2 text-green-400">
                        <Clock class="w-5 h-5" />
                        <span class="font-semibold">Real-time synchronization • Zero delays</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="relative z-10 px-6 py-20">
            <div class="max-w-4xl mx-auto text-center">
                <div
                    class="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Build Something
                        <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Amazing?
                        </span>
                    </h2>
                    <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join hundreds of businesses who trust Tempest Sites for their web presence.
                        Start your project today and see the difference real-time editing makes.
                    </p>
                    <div class="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            class="group bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                            <span>Start Your Project</span>
                            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            class="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                            Schedule a Call
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="relative z-10 px-6 py-12 border-t border-white/10">
            <div class="max-w-6xl mx-auto text-center">
                <div class="flex items-center justify-center space-x-2 mb-4">
                    <div
                        class="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm">T</span>
                    </div>
                    <span
                        class="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Tempest Sites
                    </span>
                </div>
                <p class="text-gray-400 mb-4">Part of the Tempest Studios family</p>
                <p class="text-sm text-gray-500">© 2025 Tempest Studios. Building the web, one site at a time.</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
// Import icons from Lucide Vue (you'll need to install lucide-vue-next for Vue 3)
// npm install lucide-vue-next
import {
    ArrowRight,
    Zap,
    Globe,
    Smartphone,
    Clock,
    CheckCircle,
    Rocket,
    Code,
    Palette
} from 'lucide-vue-next'
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-200 {
    animation-delay: 200ms;
}

.delay-400 {
    animation-delay: 400ms;
}

.delay-500 {
    animation-delay: 500ms;
}

.delay-1000 {
    animation-delay: 1000ms;
}
</style>