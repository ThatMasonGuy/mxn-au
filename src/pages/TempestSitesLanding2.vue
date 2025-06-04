<template>
    <div class="min-h-screen bg-gray-900 text-white overflow-hidden">
        <!-- Hero Section -->
        <section class="relative min-h-screen flex items-center justify-center px-6">
            <!-- Animated background -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse">
                </div>
                <div
                    class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000">
                </div>
                <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-ping">
                </div>
            </div>

            <div class="relative z-10 text-center max-w-6xl mx-auto">
                <div class="mb-8">
                    <h1
                        class="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent leading-tight">
                        TEMPEST
                        <span class="block text-6xl md:text-7xl">SITES</span>
                    </h1>
                    <div class="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8 rounded-full"></div>
                </div>

                <p class="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
                    Lightning-fast websites that adapt to your vision
                </p>
                <p class="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Professional website development with real-time editing, instant hosting, and mobile-first design.
                    Your digital presence, perfected.
                </p>

                <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button
                        class="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                        <span class="relative z-10">Launch Your Site</span>
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl">
                        </div>
                    </button>
                    <button
                        class="px-12 py-4 border-2 border-gray-600 rounded-full text-xl font-bold hover:border-blue-500 hover:text-blue-400 transition-all duration-300">
                        View Pricing
                    </button>
                </div>
            </div>

            <!-- Scroll indicator -->
            <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div class="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                    <div class="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section class="py-24 px-6 relative">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-20">
                    <h2
                        class="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                        Choose Your Storm
                    </h2>
                    <p class="text-xl text-gray-400 max-w-2xl mx-auto">
                        Three powerful tiers designed to match your ambition
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
                    <!-- Breeze Package -->
                    <div
                        class="group relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                        </div>
                        <div class="relative z-10">
                            <h3 class="text-2xl font-bold mb-2 text-blue-400">Breeze</h3>
                            <div class="text-5xl font-black mb-6 text-white">$500</div>
                            <ul class="space-y-4 mb-8 text-gray-300">
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    5-page website
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Mobile responsive design
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Real-time editor access
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Custom subdomain
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    1 year free hosting
                                </li>
                            </ul>
                            <button
                                class="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all duration-300">
                                Get Started
                            </button>
                        </div>
                    </div>

                    <!-- Gale Package -->
                    <div
                        class="group relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border-2 border-purple-500 hover:border-purple-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transform scale-105">
                        <div
                            class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                            MOST POPULAR
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5 rounded-3xl">
                        </div>
                        <div class="relative z-10">
                            <h3 class="text-2xl font-bold mb-2 text-purple-400">Gale</h3>
                            <div class="text-5xl font-black mb-6 text-white">$1000</div>
                            <ul class="space-y-4 mb-8 text-gray-300">
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    10-page website
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    Advanced animations
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    SEO optimization
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    Contact forms & integrations
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    Priority support
                                </li>
                            </ul>
                            <button
                                class="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-bold transition-all duration-300">
                                Get Started
                            </button>
                        </div>
                    </div>

                    <!-- Hurricane Package -->
                    <div
                        class="group relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 hover:border-indigo-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                        </div>
                        <div class="relative z-10">
                            <h3 class="text-2xl font-bold mb-2 text-indigo-400">Hurricane</h3>
                            <div class="text-5xl font-black mb-6 text-white">$1500</div>
                            <ul class="space-y-4 mb-8 text-gray-300">
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                                    Unlimited pages
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                                    E-commerce integration
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                                    Custom functionality
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                                    Advanced analytics
                                </li>
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                                    White-glove service
                                </li>
                            </ul>
                            <button
                                class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all duration-300">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Real-time Editing Section -->
        <section class="py-24 px-6 relative">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
            <div class="max-w-7xl mx-auto relative z-10">
                <div class="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2
                            class="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Edit at the Speed of Thought
                        </h2>
                        <p class="text-xl text-gray-300 mb-8 leading-relaxed">
                            Your website becomes a living, breathing extension of your creativity. Make changes
                            instantly,
                            see results immediately, and never wait for a developer again.
                        </p>
                        <div class="space-y-6">
                            <div class="flex items-start space-x-4">
                                <div
                                    class="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span class="text-blue-400 font-bold">01</span>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold mb-2 text-blue-400">Instant Updates</h3>
                                    <p class="text-gray-400">Changes go live immediately - no waiting, no delays</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-4">
                                <div
                                    class="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span class="text-purple-400 font-bold">02</span>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold mb-2 text-purple-400">Mobile Editing</h3>
                                    <p class="text-gray-400">Perfect for those 1AM inspiration strikes</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-4">
                                <div
                                    class="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span class="text-indigo-400 font-bold">03</span>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold mb-2 text-indigo-400">No Code Required</h3>
                                    <p class="text-gray-400">Intuitive visual editor that anyone can master</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="relative">
                        <div class="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700">
                            <div class="bg-gray-900 rounded-2xl p-6 mb-6">
                                <div class="flex items-center space-x-2 mb-4">
                                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div class="space-y-3">
                                    <div class="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                                    <div class="h-4 bg-blue-500/50 rounded w-1/2 animate-pulse delay-200"></div>
                                    <div class="h-4 bg-gray-700 rounded w-2/3 animate-pulse delay-400"></div>
                                </div>
                            </div>
                            <div class="text-center">
                                <div
                                    class="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
                                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span class="font-medium">Live Editor Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Subscription Model Section -->
        <section class="py-24 px-6">
            <div class="max-w-5xl mx-auto text-center">
                <h2
                    class="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                    After Year One
                </h2>
                <p class="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Keep your digital presence strong with our simple, transparent pricing
                </p>

                <div class="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-12 border border-gray-700 max-w-2xl mx-auto">
                    <div class="text-center mb-8">
                        <div class="text-6xl font-black text-white mb-4">$15</div>
                        <div class="text-xl text-gray-400">per month</div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6 text-left">
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span class="text-gray-300">Unlimited edits</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span class="text-gray-300">Hosting included</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span class="text-gray-300">SSL certificate</span>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span class="text-gray-300">Regular backups</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span class="text-gray-300">24/7 uptime monitoring</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span class="text-gray-300">Technical support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA Section -->
        <section class="py-24 px-6 relative">
            <div class="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-purple-900/20 to-transparent"></div>
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <h2
                    class="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                    Ready to Launch?
                </h2>
                <p class="text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                    Join the digital revolution. Your perfect website is just one click away.
                </p>

                <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button
                        class="group relative px-16 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                        <span class="relative z-10">Get Started Now</span>
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl">
                        </div>
                    </button>
                    <button
                        class="px-16 py-6 border-2 border-gray-600 rounded-full text-2xl font-bold hover:border-blue-500 hover:text-blue-400 transition-all duration-300">
                        Contact Us
                    </button>
                </div>

                <div class="mt-16 text-center">
                    <p class="text-sm text-gray-500 mb-4">A Tempest Studios Service</p>
                    <div class="flex justify-center space-x-8 text-gray-400 text-sm">
                        <span>yoursite.mxn.au</span>
                        <span>•</span>
                        <span>Real-time editing</span>
                        <span>•</span>
                        <span>Mobile-first</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'TempestSitesLanding'
}
</script>

<style scoped>
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}
</style>