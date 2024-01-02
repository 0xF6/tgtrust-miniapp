/// <reference types="vite/client" />
/// <reference types="vuesax-alpha/global" />


module "@vuesax-alpha/icons-vue" {}
 

module "vuesax-alpha" { 
    declare const _default: {
        version: string;
        install: (app: import("vue").App<any>, options?: Partial<import("./components").ConfigProviderProps> | undefined) => void;
    };
    export default _default;
    declare function VsLoadingFn(cfg: any); 
    export { VsLoadingFn }
}
