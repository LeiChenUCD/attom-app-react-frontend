import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: $t("menus.pureLogin"),
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: $t("status.pureLoad"),
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/iframe",
    redirect: "/iframe/index",
    meta: {
      title: "Home",
      showLink: false,
      rank: 103
    },
    children: [
      {
        path: "/iframe/index",
        name: "iframeIndex",
        meta: {
          title: "Home",
          showLink: false
        },
        component: () => import("@/views/iframe/index.vue")
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
