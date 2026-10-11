/** Assemble des classes CSS en ignorant les valeurs vides (attendu par les icones de lucide-animated). */
export const cn = (...classes) => classes.filter(Boolean).join(" ");
