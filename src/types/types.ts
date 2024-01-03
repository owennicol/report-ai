import type { allSubjects } from "../utils/utils";

export type Subjects = keyof typeof allSubjects
export type AllSubjects = Subjects[]
