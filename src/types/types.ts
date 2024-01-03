import type { allSubjects } from "../utils/utils";

export type Subjects = (typeof allSubjects)[number]
export type AllSubjects = Subjects[]
