<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="floating-orb floating-orb-1"></div>
            <div class="floating-orb floating-orb-2"></div>
            <div class="floating-orb floating-orb-3"></div>
            <div class="grid-pattern"></div>
        </div>

        <!-- Hero Section -->
        <div class="relative overflow-hidden">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="relative px-6 py-16 sm:py-24 lg:px-8">
                <div class="mx-auto max-w-4xl text-center">
                    <div class="mb-6">
                        <span
                            class="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium backdrop-blur-sm transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                            📚 The Fine Print
                        </span>
                    </div>
                    <h1
                        class="text-4xl font-bold tracking-tight text-white sm:text-6xl transform hover:scale-105 transition-transform duration-300">
                        Legal <span
                            class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Stuff</span>
                    </h1>
                    <p class="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                        The boring but important bits about using MXN Translate.
                        <span class="text-cyan-400">Promise we kept it as fun as possible! 🎉</span>
                    </p>

                    <!-- Funky updated badge -->
                    <div class="mt-8 flex items-center justify-center gap-x-6">
                        <div
                            class="flex items-center gap-2 text-sm px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
                            <Calendar class="h-4 w-4 text-emerald-400" />
                            <span class="text-gray-300">Last updated:</span>
                            <span class="text-emerald-400 font-medium">{{ content.lastUpdated }}</span>
                        </div>
                    </div>

                    <!-- More playful expand/collapse controls -->
                    <div class="mt-8 flex items-center justify-center gap-4">
                        <button @click="expandAll"
                            class="flex items-center gap-3 px-6 py-3 text-white border rounded-2xl transition-all duration-300 text-sm font-medium backdrop-blur-sm transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400/30 hover:from-cyan-400 hover:to-blue-400 shadow-lg hover:shadow-cyan-500/25">
                            <ChevronDown class="h-4 w-4" />
                            Show Everything
                        </button>
                        <button @click="collapseAll"
                            class="flex items-center gap-3 px-6 py-3 text-white border rounded-2xl transition-all duration-300 text-sm font-medium backdrop-blur-sm transform hover:scale-105 bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30">
                            <ChevronUp class="h-4 w-4" />
                            Hide It All
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="mx-auto max-w-4xl px-6 pb-16 lg:px-8 relative z-10">
            <!-- Introduction -->
            <div
                class="my-12 rounded-3xl bg-gradient-to-r from-white/5 to-white/10 p-8 backdrop-blur-lg border border-white/10 shadow-2xl transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden intro-card">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center transform -rotate-12">
                            <span class="text-xs">👋</span>
                        </div>
                        <h2 class="text-2xl font-bold text-white">Hey there! Quick intro...</h2>
                    </div>
                    <button @click="shareSection('introduction')"
                        class="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-300 opacity-70 hover:opacity-100 backdrop-blur-sm border border-white/10">
                        <Share2 class="h-4 w-4" />
                    </button>
                </div>
                <div class="prose prose-invert max-w-none space-y-4">
                    <p v-for="(paragraph, index) in content.introduction" :key="index"
                        class="text-gray-300 leading-relaxed text-lg" v-html="paragraph">
                    </p>
                </div>
            </div>

            <!-- Dynamic Sections -->
            <div v-for="(section, sectionIndex) in content.sections" :key="section.id" class="mb-8">
                <div @click="toggleSection(section.id)" :id="`section-${section.number}`"
                    class="flex items-center justify-between p-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg border border-white/10 rounded-3xl cursor-pointer transition-all duration-500 mb-6 shadow-xl relative overflow-hidden transform hover:scale-[1.02] hover:shadow-2xl section-header"
                    :class="{ 'section-expanded': expandedSections[section.id] }">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 flex items-center justify-center relative">
                            <span class="text-2xl font-bold text-white relative z-10">{{ section.number }}</span>
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl transform -rotate-6 transition-transform duration-300 hover:rotate-6">
                            </div>
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold text-white mb-1">{{ section.title }}</h2>
                            <p class="text-sm text-gray-400 font-medium">
                                {{ sectionIndex === 0 ? '📜 The rules of engagement' : '🔒 Your data, our promise' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button @click.stop="shareSection(section.number)"
                            class="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-300 opacity-70 hover:opacity-100 backdrop-blur-sm border border-white/10 transform hover:scale-110 hover:shadow-lg">
                            <Share2 class="h-4 w-4" />
                        </button>
                        <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300"
                            :class="expandedSections[section.id] ? 'bg-cyan-400/20 border-cyan-400/30' : ''">
                            <ChevronDown class="h-6 w-6 text-white transition-all duration-300"
                                :class="{ 'rotate-180 text-cyan-400': expandedSections[section.id] }" />
                        </div>
                    </div>
                </div>

                <Transition name="expand">
                    <div v-show="expandedSections[section.id]" class="space-y-6 ml-4">
                        <!-- Subsections -->
                        <div v-for="subsection in section.subsections" :key="subsection.id"
                            class="rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/10 hover:shadow-lg"
                            :id="`section-${subsection.number}`">
                            <div class="flex items-center justify-between p-6 cursor-pointer transition-all duration-200 rounded-2xl hover:bg-white/5"
                                @click="toggleSubsection(subsection.id)">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex-shrink-0">
                                    </div>
                                    <h3 class="text-xl font-semibold text-white">{{ subsection.number }}. {{
                                        subsection.title }}</h3>
                                </div>
                                <div class="flex items-center gap-3">
                                    <button @click.stop="shareSection(subsection.number)"
                                        class="p-2 text-xs rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-300 opacity-70 hover:opacity-100 backdrop-blur-sm border border-white/10">
                                        <Share2 class="h-3 w-3" />
                                    </button>
                                    <ChevronDown class="h-5 w-5 text-gray-400 transition-all duration-200"
                                        :class="{ 'rotate-180 text-cyan-400': expandedSubsections[subsection.id] }" />
                                </div>
                            </div>
                            <Transition name="expand">
                                <div v-show="expandedSubsections[subsection.id]" class="px-6 pb-6 space-y-4">
                                    <div v-for="(paragraph, index) in subsection.content" :key="index">
                                        <p v-if="paragraph.type === 'text'"
                                            class="text-gray-300 leading-relaxed hover:text-gray-200 transition-colors duration-200"
                                            :class="{ 'mt-4': index > 0, 'mb-4': paragraph.marginBottom }"
                                            v-html="paragraph.text">
                                        </p>
                                        <ul v-else-if="paragraph.type === 'list'"
                                            class="list-none text-gray-300 space-y-3 ml-4"
                                            :class="{ 'mt-4': index > 0 }">
                                            <li v-for="(item, itemIndex) in paragraph.items" :key="itemIndex"
                                                class="flex items-start gap-3 hover:text-gray-200 transition-colors duration-200"
                                                v-html="`<span class='flex-shrink-0 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mt-2'></span><span>${item}</span>`">
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- Footer -->
            <div class="mt-16 border-t border-gradient relative" ref="footerRef">
                <div
                    class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent">
                </div>
                <div class="pt-12 text-center">
                    <div class="mb-6 flex items-center justify-center gap-4 flex-wrap">
                        <div
                            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full">
                            <span class="text-2xl">🎉</span>
                            <span class="text-cyan-300 text-sm font-medium">You made it to the end!</span>
                        </div>

                        <!-- More Confetti Button - only shows after first confetti -->
                        <Transition name="slide-up">
                            <button v-if="showConfettiButton" @click="triggerMoreConfetti"
                                class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-400/30 transition-all duration-300 transform hover:scale-105 active:scale-95">
                                <span class="text-lg">🎊</span>
                                <span class="text-purple-300 text-sm font-medium">More Confetti?</span>
                                <span class="text-lg">🎊</span>
                            </button>
                        </Transition>
                    </div>
                    <p class="text-gray-400 text-sm mb-2">
                        © {{ new Date().getFullYear() }} Tempest Studios. All rights reserved.
                        <span class="text-purple-400">Built with 💜 and probably too much caffeine.</span>
                    </p>
                    <p class="text-gray-500 text-xs">
                        <span
                            class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">MXN
                            Translate</span>
                        - Making Discord multilingual, one message at a time. ✨
                    </p>

                    <!-- Dynamic fun stats -->
                    <div
                        class="mt-6 text-sm text-gray-400 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 inline-block">
                        <span class="font-medium">Words in this document: {{ wordCount.toLocaleString() }}</span>
                        <span class="mx-2">•</span>
                        <span class="font-medium">Reading time: ~{{ readingTime }} minutes</span>
                        <span class="mx-2">•</span>
                        <span class="font-medium">Coffee required: {{ coffeeEmojis }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Toast notification -->
        <Transition name="slide-up">
            <div v-if="showToast"
                class="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-white/20 backdrop-blur-sm">
                <div class="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Check class="h-4 w-4" />
                </div>
                <div>
                    <p class="font-medium">Link copied! 🎉</p>
                    <p class="text-xs opacity-90">Share the legal goodness with friends</p>
                </div>
            </div>
        </Transition>

        <!-- Confetti Canvas -->
        <canvas ref="confettiCanvas" class="fixed inset-0 pointer-events-none z-40"
            :style="{ display: showConfetti ? 'block' : 'none' }"></canvas>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed, onUnmounted } from 'vue'
import { ChevronDown, ChevronUp, Share2, Calendar, Check } from 'lucide-vue-next'

// Content data structure
const content = reactive({
    lastUpdated: 'September 2, 2025',
    introduction: [
        'These Terms of Service ("Terms") and Privacy Policy ("Policy") govern your use of MXN Translate, a Discord bot developed and operated by Tempest Studios ("we," "our" or "us"). MXN Translate allows users to translate Discord messages between multiple languages using simple commands and emoji reactions. By using the bot, you agree to be bound by these Terms and this Policy. If you do not agree, you may not use the service.',
        'We may update these Terms or this Policy from time to time. Material changes will be communicated by updating the effective date at the top of the document. Your continued use of MXN Translate after changes are posted means you accept the revised Terms and Policy.',
        'If you have any questions about these Terms or our data practices, contact us at <a href="mailto:legal@mxn.au" class="text-blue-400 hover:text-blue-300 transition-colors">legal@mxn.au</a>.'
    ],
    sections: [
        {
            id: 'terms',
            number: '1',
            title: 'Terms of Service',
            subsections: [
                {
                    id: 'terms-1-1',
                    number: '1.1',
                    title: 'Description of Service',
                    content: [
                        {
                            type: 'text',
                            text: 'MXN Translate is a Discord bot that converts text between languages. Users can invoke translations via slash commands, prefix commands, or by reacting to a message with a flag emoji. The service is offered on an "as is" basis. Translations are generated automatically by algorithms and may not always be accurate, complete or appropriate for every situation.'
                        }
                    ]
                },
                {
                    id: 'terms-1-2',
                    number: '1.2',
                    title: 'Eligibility and Acceptable Use',
                    content: [
                        {
                            type: 'text',
                            text: 'You must have a valid Discord account and be at least 13 years old (or the minimum age required in your jurisdiction) to use MXN Translate. You are responsible for complying with all applicable laws, Discord\'s Terms of Service and Community Guidelines, and these Terms. You agree not to:',
                            marginBottom: true
                        },
                        {
                            type: 'list',
                            items: [
                                'use MXN Translate for any illegal, harmful, fraudulent or abusive purpose;',
                                'upload or send content that is defamatory, obscene, harassing, hateful or violates the rights of any person;',
                                'interfere with or disrupt the operation of MXN Translate or the networks and servers used to provide it;',
                                'attempt to reverse-engineer, decompile or otherwise obtain the source code of MXN Translate or its models;',
                                'impersonate Tempest Studios or falsely suggest you are affiliated with us.'
                            ]
                        },
                        {
                            type: 'text',
                            text: 'We reserve the right to suspend or terminate your access to MXN Translate if we believe you have violated these Terms or the law. You may stop using the bot at any time.'
                        }
                    ]
                },
                {
                    id: 'terms-1-3',
                    number: '1.3',
                    title: 'Ownership and Intellectual Property',
                    content: [
                        {
                            type: 'text',
                            text: 'All rights, title and interest in MXN Translate—including its source code, design, logos, and underlying translation models—are and shall remain the exclusive property of Tempest Studios. We grant you a limited, non‑exclusive, non‑transferable, revocable licence to access and use MXN Translate solely for personal or internal business purposes in accordance with these Terms.',
                            marginBottom: true
                        },
                        {
                            type: 'text',
                            text: 'You retain ownership of any content you submit through MXN Translate. By submitting or reacting to a message for translation, you grant us a worldwide, non‑exclusive licence to process, store, display and translate the content for the sole purpose of providing and improving MXN Translate. This licence ends when your content is deleted from our systems in accordance with our retention schedule.'
                        }
                    ]
                },
                {
                    id: 'terms-1-4',
                    number: '1.4',
                    title: 'Disclaimer of Warranties',
                    content: [
                        {
                            type: 'text',
                            text: 'MXN Translate is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that translations will be error‑free, accurate, or suitable for any particular purpose, and we expressly disclaim any implied warranties of merchantability, fitness for a particular purpose, title and non‑infringement. Use MXN Translate at your own risk. Guidance generated by automated translation should be reviewed by a human before reliance.'
                        }
                    ]
                },
                {
                    id: 'terms-1-5',
                    number: '1.5',
                    title: 'Limitation of Liability',
                    content: [
                        {
                            type: 'text',
                            text: 'To the maximum extent permitted by law, Tempest Studios shall not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill or other intangible losses, resulting from (a) your access to or use of MXN Translate; (b) any conduct or content of any third party; (c) any translation errors or omissions; or (d) unauthorised access, use or alteration of your content. In no event shall our aggregate liability exceed fifty Australian dollars (AUD $50) or the amount you paid us (if any) for using MXN Translate in the twelve months preceding the event giving rise to the claim, whichever is greater.'
                        }
                    ]
                },
                {
                    id: 'terms-1-6',
                    number: '1.6',
                    title: 'Changes to the Service',
                    content: [
                        {
                            type: 'text',
                            text: 'Tempest Studios may modify, suspend or discontinue MXN Translate (or any part of it) at any time without notice. We are not liable to you or any third party for any such modifications, suspension or discontinuance.'
                        }
                    ]
                },
                {
                    id: 'terms-1-7',
                    number: '1.7',
                    title: 'Governing Law and Dispute Resolution',
                    content: [
                        {
                            type: 'text',
                            text: 'These Terms are governed by the laws of Queensland and the Commonwealth of Australia, without regard to conflict‑of‑laws principles. You agree to submit to the exclusive jurisdiction of the courts located in Queensland for the resolution of any disputes arising out of or relating to these Terms or your use of MXN Translate.'
                        }
                    ]
                },
                {
                    id: 'terms-1-8',
                    number: '1.8',
                    title: 'Contact Information',
                    content: [
                        {
                            type: 'text',
                            text: 'If you have any questions about these Terms, please contact us at <a href="mailto:legal@mxn.au" class="text-blue-400 hover:text-blue-300 transition-colors">legal@mxn.au</a>.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'privacy',
            number: '2',
            title: 'Privacy Policy',
            subsections: [
                {
                    id: 'privacy-2-1',
                    number: '2.1',
                    title: 'Scope',
                    content: [
                        {
                            type: 'text',
                            text: 'This Policy explains how Tempest Studios collects, uses, retains and protects information when you interact with MXN Translate. By using the bot, you consent to the practices described below. We may update this Policy over time; material changes will be communicated by updating the effective date at the top of the document.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-2',
                    number: '2.2',
                    title: 'Information We Collect',
                    content: [
                        {
                            type: 'text',
                            text: 'When you use MXN Translate, we collect the following types of information:',
                            marginBottom: true
                        },
                        {
                            type: 'list',
                            items: [
                                '<strong class="text-white">Message content and metadata</strong> — When you request a translation or react to a message, we capture the original message text, translation result, and limited metadata such as user and channel identifiers and timestamps. This information is necessary to provide translations, maintain context and improve our models.',
                                '<strong class="text-white">Usage data</strong> — We collect logs about how the bot is used, such as which commands and reactions were triggered, language pairs requested, server IDs and error logs. This helps us maintain and improve MXN Translate.',
                                '<strong class="text-white">Device and technical data</strong> — Discord provides us with certain technical information about your interactions, such as IP addresses and user agent strings. We do not actively associate this data with individual users but may analyse aggregated technical logs to ensure system security and performance.'
                            ]
                        },
                        {
                            type: 'text',
                            text: 'We do not intentionally collect sensitive personal information. Please do not use MXN Translate to transmit confidential or sensitive data.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-3',
                    number: '2.3',
                    title: 'How We Use Your Information',
                    content: [
                        {
                            type: 'text',
                            text: 'We use the information we collect for the following purposes:',
                            marginBottom: true
                        },
                        {
                            type: 'list',
                            items: [
                                '<strong class="text-white">Provide translations and operate MXN Translate</strong> — Your messages and usage data are processed to generate translations, deliver them back to you and keep the bot functioning properly.',
                                '<strong class="text-white">Improve and train our translation models</strong> — We may use message content, including slang and colloquial expressions, to train and fine‑tune our AI models to provide faster and more accurate translations over time. We take steps to de‑identify or aggregate data where practical and to only use data reasonably necessary for these purposes.',
                                '<strong class="text-white">Security and maintenance</strong> — We monitor usage patterns, error logs and technical data to detect abuse, troubleshoot issues and maintain the security and reliability of MXN Translate. We may use aggregated data to analyse performance trends.',
                                '<strong class="text-white">Legal compliance</strong> — We may use or disclose information as required by law, court order or legal process, or to protect the rights, property or safety of Tempest Studios, our users or others.'
                            ]
                        },
                        {
                            type: 'text',
                            text: 'We do not sell, rent or otherwise disclose your messages or personal data to third parties for marketing purposes.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-4',
                    number: '2.4',
                    title: 'Legal Basis and Consent',
                    content: [
                        {
                            type: 'text',
                            text: 'Our legal basis for collecting and processing your data depends on your location and the applicable law:',
                            marginBottom: true
                        },
                        {
                            type: 'list',
                            items: [
                                'In jurisdictions with data‑protection laws (such as the EU/UK, Canada and Australia), we rely on legitimate interests to provide and improve MXN Translate. This includes processing your messages to deliver translations and refine our models. We ensure our legitimate interests are not overridden by your fundamental rights and freedoms.',
                                'We rely on your consent to use your messages for training a more refined translation model. You grant this consent by using the service. You may withdraw your consent at any time by contacting us at <a href="mailto:legal@mxn.au" class="text-blue-400 hover:text-blue-300 transition-colors">legal@mxn.au</a> or by ceasing to use the bot.'
                            ]
                        }
                    ]
                },
                {
                    id: 'privacy-2-5',
                    number: '2.5',
                    title: 'Data Retention',
                    content: [
                        {
                            type: 'text',
                            text: 'We retain messages and metadata collected through MXN Translate only as long as necessary to fulfil the purposes described in this Policy. This generally means we store original and translated messages in a secure database for a limited period to:',
                            marginBottom: true
                        },
                        {
                            type: 'list',
                            items: [
                                'provide context for subsequent translations and caching,',
                                'troubleshoot errors and abuse,',
                                'and improve our translation models.'
                            ]
                        },
                        {
                            type: 'text',
                            text: 'After the retention period expires, data is either anonymised or deleted. Some anonymised training data may be retained indefinitely for the purpose of improving our models. In the event we need to retain data for longer to comply with legal obligations, we will do so in accordance with applicable laws.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-6',
                    number: '2.6',
                    title: 'Data Sharing and Transfers',
                    content: [
                        {
                            type: 'text',
                            text: 'We do not share or sell your messages or personal data with any third parties outside Tempest Studios. Access to data is restricted to our authorised employees, contractors and service providers who need it to operate and improve MXN Translate. These persons are bound by confidentiality obligations. We may share aggregated, anonymised statistics that do not identify individuals.',
                            marginBottom: true
                        },
                        {
                            type: 'text',
                            text: 'If we engage third‑party service providers (for example, cloud hosting), we require them to handle data in compliance with this Policy and applicable data‑protection laws.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-7',
                    number: '2.7',
                    title: 'Data Security',
                    content: [
                        {
                            type: 'text',
                            text: 'We implement reasonable administrative, technical and physical safeguards to protect the information we collect. This includes encrypting data in transit and at rest, restricting access to authorised personnel and using secure hosting environments. Despite our efforts, no security measure is perfect and we cannot guarantee absolute security. Please exercise caution and avoid sending highly sensitive information through MXN Translate.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-8',
                    number: '2.8',
                    title: 'Your Rights and Choices',
                    content: [
                        {
                            type: 'text',
                            text: 'Depending on your jurisdiction, you may have the following rights with respect to your personal data:',
                            marginBottom: true
                        },
                        {
                            type: 'list',
                            items: [
                                '<strong class="text-white">Access and rectification</strong> — You may request access to personal data we hold about you and ask us to correct inaccurate or incomplete information.',
                                '<strong class="text-white">Deletion</strong> — You may request deletion of messages or personal data we hold about you. We will comply unless we need to retain the data for legitimate business or legal purposes.',
                                '<strong class="text-white">Objection and restriction</strong> — You may object to or request restriction of certain processing activities, such as the use of your messages to train our models. If you object, we will stop processing your data for that purpose unless we can demonstrate compelling legitimate grounds.',
                                '<strong class="text-white">Withdrawal of consent</strong> — Where we rely on consent, you may withdraw that consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.'
                            ]
                        },
                        {
                            type: 'text',
                            text: 'To exercise any of these rights, contact us at <a href="mailto:legal@mxn.au" class="text-blue-400 hover:text-blue-300 transition-colors">legal@mxn.au</a>. We will respond to your request as required by applicable law.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-9',
                    number: '2.9',
                    title: 'International Transfers',
                    content: [
                        {
                            type: 'text',
                            text: 'Tempest Studios is based in Australia, but we may process data on servers in other countries. When we transfer personal data internationally, we ensure appropriate safeguards are in place to protect your information, such as using providers in jurisdictions deemed to provide adequate protection or by implementing standard contractual clauses.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-10',
                    number: '2.10',
                    title: 'Children\'s Privacy',
                    content: [
                        {
                            type: 'text',
                            text: 'MXN Translate is not directed at children under 13 years of age, and we do not knowingly collect personal information from children. If we learn that we have inadvertently collected information from a child under 13, we will delete it as soon as possible. Parents or guardians who believe we have collected information from their child should contact us at <a href="mailto:legal@mxn.au" class="text-blue-400 hover:text-blue-300 transition-colors">legal@mxn.au</a>.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-11',
                    number: '2.11',
                    title: 'Links to Third‑Party Services',
                    content: [
                        {
                            type: 'text',
                            text: 'MXN Translate may include links to third‑party websites or services (e.g., documentation or support sites). We are not responsible for the privacy practices of those third parties. We encourage you to review the privacy policies and terms of any third‑party services you access.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-12',
                    number: '2.12',
                    title: 'Changes to this Policy',
                    content: [
                        {
                            type: 'text',
                            text: 'We may update this Policy to reflect changes in our practices or applicable laws. When we update, we will revise the effective date at the top. Significant changes may also be announced through Discord or our website. Your continued use of MXN Translate after any update constitutes your acceptance of the revised Policy.'
                        }
                    ]
                },
                {
                    id: 'privacy-2-13',
                    number: '2.13',
                    title: 'Contact Us',
                    content: [
                        {
                            type: 'text',
                            text: 'If you have any questions or concerns about these Terms of Service or this Privacy Policy, or you wish to exercise your rights, please contact us at <a href="mailto:legal@mxn.au" class="text-blue-400 hover:text-blue-300 transition-colors">legal@mxn.au</a>.'
                        }
                    ]
                }
            ]
        }
    ]
})

// Reactive state
const expandedSections = reactive({
    terms: false,
    privacy: false
})

const expandedSubsections = reactive({})
const showToast = ref(false)
const showConfetti = ref(false)
const showConfettiButton = ref(false)
const footerRef = ref(null)
const confettiCanvas = ref(null)

// Dynamic word count and reading time
const wordCount = computed(() => {
    let total = 0

    // Count intro words
    content.introduction.forEach(paragraph => {
        const cleanText = paragraph.replace(/<[^>]*>/g, '')
        total += cleanText.split(/\s+/).filter(word => word.length > 0).length
    })

    // Count section content words
    content.sections.forEach(section => {
        section.subsections.forEach(subsection => {
            subsection.content.forEach(contentItem => {
                if (contentItem.type === 'text') {
                    const cleanText = contentItem.text.replace(/<[^>]*>/g, '')
                    total += cleanText.split(/\s+/).filter(word => word.length > 0).length
                } else if (contentItem.type === 'list') {
                    contentItem.items.forEach(item => {
                        const cleanText = item.replace(/<[^>]*>/g, '')
                        total += cleanText.split(/\s+/).filter(word => word.length > 0).length
                    })
                }
            })
        })
    })

    return total
})

const readingTime = computed(() => {
    // Average reading speed is 225 words per minute
    return Math.ceil(wordCount.value / 225)
})

const coffeeEmojis = computed(() => {
    const cups = Math.min(Math.ceil(readingTime.value / 4), 5) // 1 cup per 4 minutes, max 5
    return '☕'.repeat(cups)
})

// Toggle functions
const toggleSection = (section) => {
    expandedSections[section] = !expandedSections[section]
}

const toggleSubsection = (subsection) => {
    expandedSubsections[subsection] = !expandedSubsections[subsection]
}

// Check if all sections are expanded
const allSectionsExpanded = computed(() => {
    const sectionsExpanded = Object.values(expandedSections).every(expanded => expanded)
    const subsectionsExpanded = content.sections.every(section =>
        section.subsections.every(subsection => expandedSubsections[subsection.id])
    )
    return sectionsExpanded && subsectionsExpanded
})

// Expand/Collapse all functions
const expandAll = () => {
    // Expand all main sections
    Object.keys(expandedSections).forEach(key => {
        expandedSections[key] = true
    })

    // Expand all subsections
    content.sections.forEach(section => {
        section.subsections.forEach(subsection => {
            expandedSubsections[subsection.id] = true
        })
    })
}

const collapseAll = () => {
    // Collapse all main sections
    Object.keys(expandedSections).forEach(key => {
        expandedSections[key] = false
    })

    // Collapse all subsections
    Object.keys(expandedSubsections).forEach(key => {
        expandedSubsections[key] = false
    })
}

// Confetti effect
const createConfetti = () => {
    if (!confettiCanvas.value) return

    const canvas = confettiCanvas.value
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confettiPieces = []
    const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444']

    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'circle' : 'square'
        })
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        confettiPieces.forEach((piece, index) => {
            piece.x += piece.vx
            piece.y += piece.vy
            piece.rotation += piece.rotationSpeed
            piece.opacity -= 0.005

            if (piece.y > canvas.height || piece.opacity <= 0) {
                confettiPieces.splice(index, 1)
                return
            }

            ctx.save()
            ctx.globalAlpha = piece.opacity
            ctx.translate(piece.x, piece.y)
            ctx.rotate((piece.rotation * Math.PI) / 180)
            ctx.fillStyle = piece.color

            if (piece.shape === 'circle') {
                ctx.beginPath()
                ctx.arc(0, 0, piece.size / 2, 0, 2 * Math.PI)
                ctx.fill()
            } else {
                ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
            }

            ctx.restore()
        })

        if (confettiPieces.length > 0) {
            requestAnimationFrame(animate)
        } else {
            showConfetti.value = false
        }
    }

    animate()
}

// Scroll detection
let hasTriggeredConfetti = false

const handleScroll = () => {
    if (hasTriggeredConfetti || !footerRef.value) return

    const footerRect = footerRef.value.getBoundingClientRect()
    const isFooterVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0

    if (isFooterVisible && allSectionsExpanded.value) {
        hasTriggeredConfetti = true
        showConfettiButton.value = true
        showConfetti.value = true
        createConfetti()
    }
}

// Trigger more confetti on demand!
const triggerMoreConfetti = () => {
    showConfetti.value = true
    createConfetti()
}

// Reset confetti trigger when sections change
const resetConfettiTrigger = () => {
    if (!allSectionsExpanded.value) {
        hasTriggeredConfetti = false
        showConfettiButton.value = false
    }
}

// Share functionality
const shareSection = async (sectionId) => {
    const baseUrl = window.location.origin + window.location.pathname
    const url = `${baseUrl}?section=${sectionId}`

    try {
        await navigator.clipboard.writeText(url)
        showToast.value = true
        setTimeout(() => {
            showToast.value = false
        }, 3000)
    } catch (err) {
        console.error('Failed to copy URL:', err)
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        showToast.value = true
        setTimeout(() => {
            showToast.value = false
        }, 3000)
    }
}

// Handle URL parameters and scrolling
const handleUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get('section')

    if (section) {
        // Parse section parameter (e.g., "1.1", "2.3", etc.)
        const parts = section.split('.')

        if (parts.length === 1) {
            // Main section (1 or 2)
            if (parts[0] === '1') {
                expandedSections.terms = true
            } else if (parts[0] === '2') {
                expandedSections.privacy = true
            }
        } else if (parts.length === 2) {
            // Subsection (1.1, 2.3, etc.)
            const mainSection = parts[0]
            const subSection = parts[1]

            if (mainSection === '1') {
                expandedSections.terms = true
                expandedSubsections[`terms-1-${subSection}`] = true
            } else if (mainSection === '2') {
                expandedSections.privacy = true
                expandedSubsections[`privacy-2-${subSection}`] = true
            }
        }

        // Scroll to section after DOM updates
        nextTick(() => {
            setTimeout(() => {
                const targetElement = document.getElementById(`section-${section}`)
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    })
                }
            }, 100)
        })
    }
}

// Initialize on mount
onMounted(() => {
    handleUrlParams()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('popstate', handleUrlParams)

    // Watch for section changes to reset confetti trigger
    const watchSections = () => {
        resetConfettiTrigger()
    }

    // Add listeners to section toggles (this is a simple approach)
    setInterval(watchSections, 500)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('popstate', handleUrlParams)
})
</script>

<style scoped>
/* Only keeping the essential animations that can't be done with Tailwind */
.floating-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.15;
    animation: float 20s ease-in-out infinite;
}

.floating-orb-1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(45deg, #06b6d4, #8b5cf6);
    top: 10%;
    left: -5%;
    animation-delay: 0s;
}

.floating-orb-2 {
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #8b5cf6, #ec4899);
    top: 60%;
    right: -10%;
    animation-delay: -10s;
}

.floating-orb-3 {
    width: 150px;
    height: 150px;
    background: linear-gradient(45deg, #06b6d4, #10b981);
    bottom: 20%;
    left: 60%;
    animation-delay: -15s;
}

.grid-pattern {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: grid-move 30s linear infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    25% {
        transform: translateY(-20px) rotate(90deg);
    }

    50% {
        transform: translateY(-10px) rotate(180deg);
    }

    75% {
        transform: translateY(-30px) rotate(270deg);
    }
}

@keyframes grid-move {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(50px, 50px);
    }
}

.intro-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    background: linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
}

.intro-card:hover::before {
    opacity: 1;
}

.section-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
}

.section-header:hover::before,
.section-expanded::before {
    opacity: 1;
}

.expand-enter-active,
.expand-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top;
}

.expand-enter-from {
    opacity: 0;
    transform: scaleY(0.95) translateY(-20px);
}

.expand-leave-to {
    opacity: 0;
    transform: scaleY(0.95) translateY(-20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotate(-5deg);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateY(30px) scale(0.9) rotate(5deg);
}

::-webkit-scrollbar {
    width: 12px;
}

::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5));
    border-radius: 6px;
    transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, rgba(6, 182, 212, 0.8), rgba(139, 92, 246, 0.8));
}

::selection {
    background: rgba(6, 182, 212, 0.3);
    color: white;
}

@media (max-width: 640px) {
    .floating-orb {
        display: none;
    }
}
</style>