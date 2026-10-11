export const THEME_KEY = "tk.theme";

/** Execute avant le premier rendu : applique le theme choisi, sinon celui du systeme, sans flash. */
export const THEME_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t}catch(e){d.dataset.theme="light"}})()`;
