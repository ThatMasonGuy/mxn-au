export default [
    // --- Professional Landing Page (Public) ---
    {
        path: '/professional',
        name: 'Professional',
        component: () => import('@/pages/professional/ProfessionalLanding.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Professional Suite',
            drawerRanking: 0,
            drawerVisible: false,
            layout: 'default',
            description: 'Professional suite for small business management - contacts and invoicing.',
            badge: '',
            requiresOverlay: false,
        },
    },

    // --- Professional Dashboard (Auth Required) ---
    {
        path: '/professional/home',
        name: 'Professional - Dashboard',
        component: () => import('@/pages/professional/ProfessionalDashboard.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Dashboard',
            drawerRanking: 1,
            drawerVisible: true,
            layout: 'professional',
            description: 'Professional suite dashboard with statistics and quick actions.',
            badge: '',
            requiresOverlay: false,
        },
    },

    // --- Company Settings ---
    {
        path: '/professional/company',
        name: 'Professional - Company',
        component: () => import('@/pages/professional/CompanySettings.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Company',
            drawerRanking: 2,
            drawerVisible: true,
            layout: 'professional',
            description: 'Manage company information, logo, and branding settings.',
            badge: '',
            requiresOverlay: false,
        },
    },

    // --- Contacts ---
    {
        path: '/professional/contacts',
        name: 'Professional - Contacts',
        component: () => import('@/pages/professional/ContactsList.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Contacts',
            drawerRanking: 3,
            drawerVisible: true,
            layout: 'professional',
            description: 'Manage your clients and vendors contact information.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/professional/contacts/new',
        name: 'Professional - New Contact',
        component: () => import('@/pages/professional/ContactForm.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'New Contact',
            drawerRanking: 0,
            drawerVisible: false,
            layout: 'professional',
            description: 'Add a new client or vendor contact.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/professional/contacts/:id/edit',
        name: 'Professional - Edit Contact',
        component: () => import('@/pages/professional/ContactForm.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Edit Contact',
            drawerRanking: 0,
            drawerVisible: false,
            layout: 'professional',
            description: 'Edit contact information.',
            badge: '',
            requiresOverlay: false,
        },
    },

    // --- Invoices ---
    {
        path: '/professional/invoices',
        name: 'Professional - Invoices',
        component: () => import('@/pages/professional/InvoicesList.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Invoices',
            drawerRanking: 4,
            drawerVisible: true,
            layout: 'professional',
            description: 'View and manage all your invoices.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/professional/invoices/new',
        name: 'Professional - New Invoice',
        component: () => import('@/pages/professional/InvoiceForm.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'New Invoice',
            drawerRanking: 0,
            drawerVisible: false,
            layout: 'professional',
            description: 'Create a new invoice for your client.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/professional/invoices/:id',
        name: 'Professional - View Invoice',
        component: () => import('@/pages/professional/InvoiceView.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Invoice Details',
            drawerRanking: 0,
            drawerVisible: false,
            layout: 'professional',
            description: 'View and print invoice details.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/professional/invoices/:id/edit',
        name: 'Professional - Edit Invoice',
        component: () => import('@/pages/professional/InvoiceForm.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Edit Invoice',
            drawerRanking: 0,
            drawerVisible: false,
            layout: 'professional',
            description: 'Edit invoice details and line items.',
            badge: '',
            requiresOverlay: false,
        },
    },

    // --- Settings ---
    {
        path: '/professional/settings',
        name: 'Professional - Settings',
        component: () => import('@/pages/professional/ProfessionalSettings.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Settings',
            drawerRanking: 5,
            drawerVisible: true,
            layout: 'professional',
            description: 'Customize appearance and preferences.',
            badge: '',
            requiresOverlay: false,
        },
    },

    // --- Test Page ---
    {
        path: '/professional/test',
        name: 'Professional Test',
        component: () => import('@/pages/professional/TestProfessional.vue'),
        meta: {
            requiresAuth: false,
            layout: 'professional',
            title: 'Test Page'
        }
    }
]