import "@devops/bk-magic-vue/dist/bk-magic-vue.min.css";

export default async ({ Vue, isServer }) => {
    if (!isServer) {
        await import("@devops/bk-magic-vue").then((bkMagicVue) => {
            Vue.use(bkMagicVue);
        });
    }
};
