// Composables
import { onAnyEnter, onLoginEnter } from "@/router/navigationGuards";
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: () => import("../views/home/Root.vue"),
        children: [
            {
                path: "",
                name: "home",
                component: () => import("../views/home/Home.vue")
            }
        ]
    },
    {
        path: "/",
        component: () => import("../views/home/Root.vue"),
        children: [
            {
                path: "components",
                name: "components",
                component: () => import("../views/home/Components.vue")
            },
            {
                path: "projects",
                name: "projects",
                component: () => import("../views/home/Projects.vue")
            },
            {
                path: "imss",
                name: "imss",
                component: () => import("../views/home/IMSs.vue")
            },
            {
                path: "admin",
                name: "admin",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "",
                        name: "admin-permissions",
                        component: () => import("../views/admin/Permissions.vue")
                    },
                    {
                        path: "strategy-instances",
                        name: "admin-strategy-instances",
                        component: () => import("../views/admin/StrategyInstances.vue")
                    },
                    {
                        path: "auth-clients",
                        name: "admin-auth-clients",
                        component: () => import("../views/admin/AuthClients.vue")
                    },
                    {
                        path: "legal-information",
                        name: "admin-legal-information",
                        component: () => import("../views/admin/LegalInformation.vue")
                    },
                    {
                        path: "graphiql",
                        name: "admin-graphiql",
                        component: () => import("../views/admin/GraphiQL.vue")
                    }
                ]
            }
        ]
    },
    {
        path: "/components/:trackable",
        component: () => import("../views/component/Root.vue"),
        children: [
            {
                path: "",
                name: "component",
                component: () => import("../views/component/Home.vue")
            }
        ]
    },
    {
        path: "/components/:trackable",
        component: () => import("../views/component/Root.vue"),
        children: [
            {
                path: "details",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "",
                        name: "component-details-general",
                        component: () => import("../views/component/details/General.vue")
                    },
                    {
                        path: "interface-specifications",
                        name: "component-details-interfaces",
                        component: () => import("../views/component/details/Interfaces.vue")
                    },
                    {
                        path: "labels",
                        name: "component-details-labels",
                        component: () => import("../views/trackable/Labels.vue")
                    },
                    {
                        path: "sync",
                        name: "component-details-sync",
                        component: () => import("../views/trackable/IMSProjects.vue")
                    },
                    {
                        path: "permissions",
                        name: "component-details-permissions",
                        component: () => import("../views/component/details/Permissions.vue")
                    },
                    {
                        path: "danger",
                        name: "component-details-danger",
                        component: () => import("../views/component/details/Danger.vue")
                    }
                ]
            },
            {
                path: "interface-specifications/:interfaceSpecification",
                name: "interface-specification-versions",
                component: () => import("../views/component/interfaces/version/Versions.vue")
            },
            {
                path: "interface-specifications/:interfaceSpecification",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "details",
                        component: () => import("../views/RouterOnly.vue"),
                        children: [
                            {
                                path: "",
                                name: "interface-specification-details-general",
                                component: () => import("../views/component/interfaces/details/General.vue")
                            },
                            {
                                path: "danger",
                                name: "interface-specification-details-danger",
                                component: () => import("../views/component/interfaces/details/Danger.vue")
                            }
                        ]
                    },
                    {
                        path: "versions/:interfaceSpecificationVersion",
                        component: () => import("../views/RouterOnly.vue"),
                        children: [
                            {
                                path: "",
                                name: "interface-specification-version-general",
                                component: () => import("../views/component/interfaces/version/General.vue")
                            },
                            {
                                path: "danger",
                                name: "interface-specification-version-danger",
                                component: () => import("../views/component/interfaces/version/Danger.vue")
                            }
                        ]
                    }
                ]
            },
            {
                path: "versions",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "",
                        name: "component-versions",
                        component: () => import("../views/component/version/Versions.vue")
                    },
                    {
                        path: ":version",
                        component: () => import("../views/RouterOnly.vue"),
                        children: [
                            {
                                path: "",
                                name: "component-version-general",
                                component: () => import("../views/component/version/General.vue")
                            },
                            {
                                path: "interfaces",
                                name: "component-version-interfaces",
                                component: () => import("../views/component/version/Interfaces.vue")
                            },
                            {
                                path: "danger",
                                name: "component-version-danger",
                                component: () => import("../views/component/version/Danger.vue")
                            }
                        ]
                    }
                ]
            },
            {
                path: "issues",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "",
                        name: "component-issues",
                        component: () => import("../views/issue/Issues.vue")
                    },
                    {
                        path: ":issue",
                        name: "component-issue",
                        component: () => import("../views/issue/Issue.vue")
                    }
                ]
            }
        ]
    },
    {
        path: "/projects/:trackable",
        component: () => import("../views/project/Root.vue"),
        children: [
            {
                path: "",
                name: "project",
                component: () => import("../views/project/Home.vue")
            }
        ]
    },
    {
        path: "/projects/:trackable",
        component: () => import("../views/project/Root.vue"),
        children: [
            {
                path: "details",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "",
                        name: "project-details-general",
                        component: () => import("../views/project/details/General.vue")
                    },
                    {
                        path: "views",
                        name: "project-details-views",
                        component: () => import("../views/project/details/Views.vue")
                    },
                    {
                        path: "labels",
                        name: "project-details-labels",
                        component: () => import("../views/trackable/Labels.vue")
                    },
                    {
                        path: "sync",
                        name: "project-details-sync",
                        component: () => import("../views/trackable/IMSProjects.vue")
                    },
                    {
                        path: "permissions",
                        name: "project-details-permissions",
                        component: () => import("../views/project/details/Permissions.vue")
                    },
                    {
                        path: "danger",
                        name: "project-details-danger",
                        component: () => import("../views/project/details/Danger.vue")
                    }
                ]
            },
            {
                path: "issues",
                name: "project-issues",
                component: () => import("../views/issue/Issues.vue")
            },
            {
                path: "issues",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "",
                        name: "project-issues",
                        component: () => import("../views/issue/Issues.vue")
                    },
                    {
                        path: ":issue",
                        name: "project-issue",
                        component: () => import("../views/issue/Issue.vue")
                    }
                ]
            },
            {
                path: "component-issues",
                name: "project-component-issues",
                component: () => import("../views/project/ComponentIssues.vue")
            }
        ]
    },
    {
        path: "/imss/:ims",
        component: () => import("../views/ims/Root.vue"),
        children: [
            {
                path: "",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "",
                        name: "ims",
                        component: () => import("../views/ims/project/Projects.vue")
                    },
                    {
                        path: "project/:project",
                        component: () => import("../views/RouterOnly.vue"),
                        children: [
                            {
                                path: "",
                                name: "ims-project-general",
                                component: () => import("../views/ims/project/General.vue")
                            },
                            {
                                path: "danger",
                                name: "ims-project-danger",
                                component: () => import("../views/ims/project/Danger.vue")
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "/imss/:ims",
        component: () => import("../views/ims/Root.vue"),
        children: [
            {
                path: "details",
                component: () => import("../views/RouterOnly.vue"),
                children: [
                    {
                        path: "",
                        name: "ims-details-general",
                        component: () => import("../views/ims/details/General.vue")
                    },
                    {
                        path: "permissions",
                        name: "ims-details-permissions",
                        component: () => import("../views/ims/details/Permissions.vue")
                    },
                    {
                        path: "danger",
                        name: "ims-details-danger",
                        component: () => import("../views/ims/details/Danger.vue")
                    }
                ]
            }
        ]
    },
    {
        path: "/graphiql",
        component: () => import("../views/graphiql/Root.vue"),
        children: [
            {
                path: "",
                component: () => import("../views/admin/GraphiQL.vue")
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/RouterOnly.vue"),
        beforeEnter: onLoginEnter
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach(onAnyEnter);

export default router;
