// src/components/question-section.tsx

import { useState, Dispatch, SetStateAction } from "react"; // 1. Import new types
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Volume2, VolumeX } from "lucide-react";
import { RecordAnswer } from "./record-answer";
import { Question } from "@/types"; // 2. Import the Question type if it's not already global

// 3. UPDATE THE PROPS INTERFACE to accept the shared state
interface QuestionSectionProps {
  questions: Question[];
  isWebCamEnabled: boolean;
  setIsWebCamEnabled: Dispatch<SetStateAction<boolean>>;
  interviewId: string;
}

// 4. DESTRUCTURE THE NEW PROPS in the component signature
export const QuestionSection = ({
  questions,
  isWebCamEnabled,
  setIsWebCamEnabled,
  interviewId,
}: QuestionSectionProps) => {
  // 5. REMOVE THE LOCAL WEBCAM STATE: const [isWebCam, setIsWebCam] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayQuestion = (qst: string) => {
    if (isPlaying && currentSpeech) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);
        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      }
    }
  };

  return (
    <div className="w-full flex md:flex-row flex-col gap-8">
      {/* Question List and Details */}
      <div className="w-full md:w-1/2 min-h-96 border rounded-md p-4">
        <Tabs
          defaultValue={questions[0]?.question}
          className="w-full space-y-12"
          orientation="vertical"
        >
          <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
            {questions?.map((tab, i) => (
              <TabsTrigger
                className={cn("data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-2")}
                key={tab.question}
                value={tab.question}
              >
                {`Question #${i + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>

          {questions?.map((tab, i) => (
            <TabsContent key={i} value={tab.question}>
              <p className="text-base text-left tracking-wide text-neutral-500">
                {tab.question}
              </p>
              <div className="w-full flex items-center justify-end">
                <TooltipButton
                  content={isPlaying ? "Stop" : "Start"}
                  icon={isPlaying ? <VolumeX /> : <Volume2 />}
                  onClick={() => handlePlayQuestion(tab.question)}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Answer and Webcam Section */}
      <div className="w-full md:w-1/2">
        {/* 6. PASS THE SHARED PROPS down to the RecordAnswer component */}
        <RecordAnswer
          questions={questions}
          isWebCamEnabled={isWebCamEnabled}
          setIsWebCamEnabled={setIsWebCamEnabled}
          interviewId={interviewId}
        />
      </div>
    </div>
  );
};