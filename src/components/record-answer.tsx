/* eslint-disable @typescript-eslint/no-unused-vars */
import { ResultType } from "react-hook-speech-to-text"
import { useAuth } from "@clerk/clerk-react";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react"; // 1. Import new types
import useSpeechToText from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { SaveModal } from "./save-modal";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Question } from "@/types"; // Import your Question type

// 2. UPDATE THE PROPS INTERFACE
interface RecordAnswerProps {
  questions: Question[];
  isWebCamEnabled: boolean;
  setIsWebCamEnabled: Dispatch<SetStateAction<boolean>>;
  interviewId: string;
}

interface AIResponse {
  rating: number; // Changed to rating to match your AI prompt better
  feedback: string;
}

// 3. UPDATE THE COMPONENT SIGNATURE to use the new props
export const RecordAnswer = ({
  questions,
  isWebCamEnabled,
  setIsWebCamEnabled,
  interviewId,
}: RecordAnswerProps) => {
  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // 4. ADD STATE to track the current question
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const { userId } = useAuth();

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const cleanJsonResponse = (responseText: string): AIResponse => {
    const cleanText = responseText.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      throw new Error("Invalid JSON format from AI.");
    }
  };

  const generateResult = async () => {
    if (userAnswer.length < 10) {
      toast.error("Your answer is too short. Please provide more detail.");
      return;
    }

    setIsAiGenerating(true);
    const currentQuestion = questions[activeQuestionIndex];
    const prompt = `
      Question: "${currentQuestion.question}"
      User Answer: "${userAnswer}"
      Correct Answer: "${currentQuestion.answer}"
      Please provide a rating (from 1 to 10) for the user's answer and offer constructive feedback for improvement.
      Return the result in JSON format with two fields: "rating" (a number) and "feedback" (a string).
    `;

    try {
      const result = await chatSession.sendMessage(prompt);
      const parsedResult = cleanJsonResponse(result.response.text());
      setAiResult(parsedResult);
    } catch (error) {
      toast.error("An error occurred while generating feedback.");
    } finally {
      setIsAiGenerating(false);
    }
  };
  
  // This useEffect will now trigger the AI generation when recording stops
  useEffect(() => {
    if (!isRecording && userAnswer.length > 0) {
        generateResult();
    }
  }, [userAnswer, isRecording]);

  const saveUserAnswer = async () => {
    setLoading(true);

    if (!aiResult) return;
    
    const currentQuestion = questions[activeQuestionIndex];
    
    try {
      await addDoc(collection(db, "userAnswers"), {
        mockIdRef: interviewId,
        question: currentQuestion.question,
        correct_ans: currentQuestion.answer,
        user_ans: userAnswer,
        feedback: aiResult.feedback,
        rating: aiResult.rating,
        userId,
        createdAt: serverTimestamp(),
      });
      toast.success("Your answer has been saved!");
      
      // Clear state for next question
      setResults([]);
      setUserAnswer("");
      setAiResult(null);

      // Move to next question or end interview
      if (activeQuestionIndex < questions.length - 1) {
        setActiveQuestionIndex(activeQuestionIndex + 1);
      } else {
        // Navigate to feedback page after the last question is saved
        window.location.href = `/generate/feedback/${interviewId}`;
      }

    } catch (error) {
      toast.error("An error occurred while saving your answer.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

useEffect(() => {
  const combinedTranscript = results
    .filter((result): result is ResultType => typeof result !== "string") // Add this filter
    .map((result) => result.transcript)
    .join(" ");

  setUserAnswer(combinedTranscript);
}, [results]);
  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      <div className="w-full h-[300px] md:h-80 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {/* 5. USE THE CORRECT PROP `isWebCamEnabled` */}
        {isWebCamEnabled ? (
          <WebCam
            mirrored={true}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <TooltipButton
          content={isWebCamEnabled ? "Turn Off" : "Turn On"}
          icon={isWebCamEnabled ? <VideoOff /> : <Video />}
          onClick={() => setIsWebCamEnabled(!isWebCamEnabled)} // Use the setter from props
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={isRecording ? <CircleStop /> : <Mic />}
          onClick={recordUserAnswer}
          disabled={isAiGenerating}
        />

        <TooltipButton
          content="Save Answer"
          icon={isAiGenerating ? <Loader className="animate-spin" /> : <Save />}
          onClick={() => setOpen(true)}
          disabled={!aiResult} // 6. FIXED TYPO `disbaled` -> `disabled`
        />
      </div>

      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold">Your Answer:</h2>
        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Your recorded answer will appear here."}
        </p>
      </div>
      
      {aiResult && (
        <div className="w-full mt-2 p-4 border rounded-md bg-blue-50">
            <h2 className="text-lg font-semibold">Feedback</h2>
            <p><strong className="text-blue-700">Rating:</strong> {aiResult.rating}/10</p>
            <p className="mt-2"><strong className="text-blue-700">Notes:</strong> {aiResult.feedback}</p>
        </div>
      )}
    </div>
  );
};