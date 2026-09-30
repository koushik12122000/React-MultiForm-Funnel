import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import LaunchScreen from './components/LaunchScreen';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import CalculatingStep from './components/CalculatingStep';
import LeadCaptureStep from './components/LeadCaptureStep';
import ConfirmationStep from './components/ConfirmationStep';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';

import { 
  ALL_QUESTIONS, 
  INITIAL_STEP_ID, 
  getQuestionById, 
  getNextStepId 
} from './data/questions';

import { trackEvent } from './services/analytics';
import { extractTrackingParams } from './services/urlParams';
import { prepareLeadPayload, submitLead } from './services/leadService';

// Flow states
const STEP_LAUNCH = 'launch';
const STEP_QUESTIONS = 'questions';
const STEP_CALCULATING = 'calculating';
const STEP_LEAD_CAPTURE = 'lead_capture';
const STEP_CONFIRMATION = 'confirmation';

export default function App() {
  const [currentStepId, setCurrentStepId] = useState(INITIAL_STEP_ID);
  const [stepHistory, setStepHistory] = useState([]);
  const [flowState, setFlowState] = useState(STEP_LAUNCH); // Start on launch screen
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadPayload, setLeadPayload] = useState(null);
  const [legalModalType, setLegalModalType] = useState(null);

  const startTimeRef = useRef(Date.now());

  // Track initial landing and extract URL parameters
  useEffect(() => {
    startTimeRef.current = Date.now();
    const params = extractTrackingParams();

    // Fire Initial Meta Pixel PageView
    trackEvent('PageView', {
      landing_page: params.landing_page_url,
      utm_source: params.utm_source,
      utm_campaign: params.utm_campaign
    });
  }, []);

  // Handle option selection with dynamic branching
  const handleSelectOption = (questionId, value) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: value
    };
    setAnswers(updatedAnswers);

    // Compute next step based on the live branching tree
    const nextStepId = getNextStepId(questionId, value, updatedAnswers);

    if (nextStepId === 'DONE') {
      // Reached conclusion of questions -> advance to pre-qualification calculation
      setFlowState(STEP_CALCULATING);
      trackEvent('ViewContent', {
        content_name: 'disability_qualification_calculating',
        total_questions_answered: Object.keys(updatedAnswers).length
      });
    } else {
      // Push current step into history stack for robust Back navigation
      setStepHistory((prev) => [...prev, questionId]);
      setCurrentStepId(nextStepId);
    }
  };

  // Handle Back Button navigating back through visited history
  const handleBack = () => {
    if (flowState === STEP_QUESTIONS) {
      if (stepHistory.length > 0) {
        const prevStepId = stepHistory[stepHistory.length - 1];
        setStepHistory((prev) => prev.slice(0, -1));
        setCurrentStepId(prevStepId);
      } else {
        // Return to launch screen if on the very first question
        setFlowState(STEP_LAUNCH);
      }
    } else if (flowState === STEP_LEAD_CAPTURE && stepHistory.length > 0) {
      // Allow user to return from email step to the last question
      setFlowState(STEP_QUESTIONS);
      const lastQuestionId = stepHistory[stepHistory.length - 1];
      setCurrentStepId(lastQuestionId);
    }
  };

  // Handle Calculation Screen completion
  const handleCalculationComplete = () => {
    setFlowState(STEP_LEAD_CAPTURE);
    trackEvent('InitiateCheckout', {
      qualification_status: 'pre_qualified',
      estimated_monthly_value: 4152.00
    });
  };

  // Handle Final Lead Capture Submission (Name, Phone, Email)
  const handleLeadSubmit = async ({ fullName, phone, email }) => {
    setIsSubmitting(true);
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      // Prepare standardized payload matching backend / Meta CAPI specs
      const payload = await prepareLeadPayload({
        fullName,
        phone,
        email,
        answers,
        durationSeconds
      });

      // Submit through resilient lead service (Webhook / Local resilience vault)
      await submitLead(payload);
      setLeadPayload(payload);

      // Track Meta Pixel 'Lead' event with matching event_id and enriched user parameters
      trackEvent('Lead', {
        currency: 'USD',
        value: 4152.00,
        content_category: 'disability_benefits',
        lead_id: payload.lead_id
      }, {
        em: payload.lead.hashed_email,
        ph: payload.lead.hashed_phone,
        fn: payload.lead.hashed_first_name,
        ln: payload.lead.hashed_last_name
      }, payload.meta_event_id);

      // Advance to Confirmation screen
      setFlowState(STEP_CONFIRMATION);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Restart Funnel
  const handleRestart = () => {
    setAnswers({});
    setStepHistory([]);
    setCurrentStepId(INITIAL_STEP_ID);
    setFlowState(STEP_LAUNCH);
    setLeadPayload(null);
    startTimeRef.current = Date.now();
  };

  const currentQuestion = getQuestionById(currentStepId);
  const questionsCompletedCount = stepHistory.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Clean Brand Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10">
        
        {/* Progress Bar (Visible during questions) */}
        {flowState === STEP_QUESTIONS && (
          <ProgressBar
            currentStep={questionsCompletedCount}
            onBack={handleBack}
            canGoBack={true}
          />
        )}

        {/* Step Views */}
        <div className="w-full">
          {flowState === STEP_LAUNCH && (
            <LaunchScreen onStart={() => setFlowState(STEP_QUESTIONS)} />
          )}

          {flowState === STEP_QUESTIONS && currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              currentValue={answers[currentQuestion.id]}
              onSelect={handleSelectOption}
              isFirstStep={currentStepId === INITIAL_STEP_ID}
            />
          )}

          {flowState === STEP_CALCULATING && (
            <CalculatingStep onComplete={handleCalculationComplete} />
          )}

          {flowState === STEP_LEAD_CAPTURE && (
            <LeadCaptureStep
              onSubmit={handleLeadSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {flowState === STEP_CONFIRMATION && (
            <ConfirmationStep
              leadData={leadPayload}
              onRestart={handleRestart}
            />
          )}
        </div>

      </main>

      {/* Clean Footer with required legal disclaimers */}
      <Footer onOpenLegal={(type) => setLegalModalType(type)} />

      {/* Legal Disclaimers Modal */}
      <LegalModal
        isOpen={Boolean(legalModalType)}
        modalType={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
}
