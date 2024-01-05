import { allSubjects, possibleAssessments } from "../utils/utils";

export type Subjects = (typeof allSubjects)[number]
export type PossibleAssessments = (typeof possibleAssessments)[number]
