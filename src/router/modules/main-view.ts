import { $t } from "@/plugins/i18n";

export default {
  path: "/main-view",
  meta: {
    icon: "ri:file-info-line",
    title: $t("menus.main-view"),
    rank: 1,
    showLink: false
  },
  children: [
    {
      path: "/main-view/index/:censustractId",
      name: "About",
      component: () => import("@/views/main-view/index.vue"),
      meta: {
        title: $t("menus.main-view"),
        activePath: "/welcome",
      }
    }
  ]
} satisfies RouteConfigsTable;
