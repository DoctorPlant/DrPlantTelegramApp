import {Page} from "@/components/Page";
import {QuizRunner} from "@/components/QuizRunner";
import rawQuiz from "@/quizzes/plant-doctor.json";
import {QuizTreeSchema} from "@/quiz/schema";

const quiz = QuizTreeSchema.parse(rawQuiz);

export const PlantDoctorPage = () => (
    <Page back>
        <QuizRunner tree={quiz}/>
    </Page>
);
