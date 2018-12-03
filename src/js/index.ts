/**
 * Styles
 */
import "../scss/index.scss";

/**
 * Modules
 */
import { silcCoreInit } from "silc-core";
import { silcAccordionInit } from "silc-accordion";
import { silcNavInit } from "silc-nav";
import { silcOffcanvasInit } from "silc-offcanvas";

// import  "../js/twitter";
// import {vueComponent} from "../components/vue-comp/vue-comp";

// import InstaFeed from "../components/instafeed/instafeed";
import {instaVueInit} from "../components/instavue/instavue"
// import {facebookVueInit} from "../components/facebook/facebook"

// new InstaFeed();

instaVueInit();
// facebookVueInit();
// vueComponent();
/**
 * Init
 */

silcCoreInit();
silcAccordionInit();
silcNavInit();
silcOffcanvasInit();
