/**
 * questions.js
 * 
 * Complete branched question set and conditional routing logic
 * extracted directly from the live funnel (https://funnel.disabilitypath.org/qualification-v30).
 */

export const INITIAL_STEP_ID = 'is_over_40';

export const ALL_QUESTIONS = [
  // Step 0: Opt-in / Landing question
  {
    id: 'is_over_40',
    title: 'Are You 40 Years or Older?',
    subtext: 'Social Security Disability guidelines adjust eligibility rules starting at age 40 and 50.',
    type: 'single_choice',
    options: [
      { label: 'YES', value: 'yes', icon: 'CheckCircle2', color: 'emerald' },
      { label: 'NO', value: 'no', icon: 'XCircle', color: 'rose' }
    ]
  },

  // Q1: Current benefits
  {
    id: 'receiving_ben',
    title: 'Which of the following disability benefits are you currently receiving?',
    subtext: 'Select the option that matches your current government benefit status.',
    type: 'single_choice',
    options: [
      { 
        label: 'Social Security Disability (SSD) Benefits', 
        value: 'Social Security Disability (SSD) Benefits',
        badge: 'SSD',
        description: 'Monthly benefits based on past work earnings' 
      },
      { 
        label: 'Supplemental Security Income (SSI) Benefits', 
        value: 'Supplemental Security Income (SSI) Benefits',
        badge: 'SSI',
        description: 'Needs-based monthly financial assistance' 
      },
      { 
        label: 'Both SSD and SSI Benefits', 
        value: 'Both SSD and SSI Benefits',
        badge: 'Both',
        description: 'Concurrent monthly benefit payments' 
      },
      { 
        label: 'I am not receiving any disability benefits (SSD or SSI)', 
        value: 'I am not receiving any disability benefits (SSD or SSI)',
        badge: 'None',
        description: 'Seeking to apply or check qualification for benefits' 
      }
    ]
  },

  // Q2: Work hours
  {
    id: 'page_sm72h5',
    title: 'How many hours per week are you currently working?',
    subtext: 'The SSA evaluates substantial gainful activity (SGA) based on monthly work and earnings.',
    type: 'single_choice',
    options: [
      { label: 'Not working', value: 'Not working', badge: '0 hrs' },
      { label: '20 hours or less per week', value: '20 hours or less per week', badge: '1-20 hrs' },
      { label: 'More than 20 hours per week', value: 'More than 20 hours per week', badge: '20+ hrs' }
    ]
  },

  // Q2b (Branch: only if 'Not working'): When did you last work?
  {
    id: 'lastworked',
    title: 'When did you last work?',
    subtext: 'Helps evaluate recent insured work status under Social Security regulations.',
    type: 'single_choice',
    options: [
      { label: 'Within the last 4 months', value: 'Within the last 4 months' },
      { label: '4 to 7 months ago', value: '4 to 7 months ago' },
      { label: '7 to 12 months ago', value: '7 to 12 months ago' },
      { label: 'More than 12 months ago', value: 'More than 12 months ago' }
    ]
  },

  // Q3: Years employed in past 10 years
  {
    id: 'fiveyearwork',
    title: 'In the past 10 years, how many years have you been employed?',
    subtext: 'Work credits are calculated based on your total insured employment history.',
    type: 'single_choice',
    options: [
      { label: 'Less than 2 years', value: 'Less than 2 years' },
      { label: 'Between 2 and 4 years', value: 'Between 2 and 4 years' },
      { label: 'Between 4 and 6 years', value: 'Between 4 and 6 years' },
      { label: 'More than 6 years', value: 'More than 6 years' }
    ]
  },

  // Q4 (Branch: shown if less than 4 years of work history): Assets
  {
    id: 'page_lyensr',
    title: 'What is the total value of your assets? (Do not include house & car)',
    subtext: 'Certain programs evaluate liquid assets such as checking, savings, or investments.',
    type: 'single_choice',
    options: [
      { label: 'Less than $2000', value: 'Less than $2000' },
      { label: 'More than $2000', value: 'More than $2000' },
      { label: 'Not Sure', value: 'Not Sure' }
    ]
  },

  // Q5: Out of work duration expectation
  {
    id: 'outofwork',
    title: 'Do you expect to be out of work for at least a year due to a disability?',
    subtext: 'SSA criteria requires medical conditions that last or are expected to last 12+ months.',
    type: 'single_choice',
    options: [
      { label: 'Yes', value: 'Yes', icon: 'CheckCircle2' },
      { label: 'No', value: 'No', icon: 'XCircle' }
    ]
  },

  // Q5b (Branch: shown if 'Yes' AND was 'Not working'): Condition start
  {
    id: 'conditionstart',
    title: 'When did your condition start keeping you from working?',
    subtext: 'An approximate date is fine. This is when your health started keeping you from working, not date of diagnosis.',
    type: 'single_choice',
    options: [
      { label: 'Within the last 6 months', value: 'Within the last 6 months' },
      { label: '6 to 12 months ago', value: '6 to 12 months ago' },
      { label: 'More than 1 year ago', value: 'More than 1 year ago' },
      { label: "I'm not sure", value: "I'm not sure" }
    ]
  },

  // Q6: Seeing a doctor / medication
  {
    id: 'visit',
    title: 'Are you currently seeing a doctor or taking prescribed medication for a disability?',
    subtext: 'Documented medical records and physician treatments strengthen your disability file.',
    type: 'single_choice',
    options: [
      { label: 'Yes', value: 'Yes', icon: 'CheckCircle2' },
      { label: 'No', value: 'No', icon: 'XCircle' }
    ]
  },

  // Q6b (Branch: shown if 'No' to seeing a doctor): Last doctor visit
  {
    id: 'page_zbkz5e',
    title: 'When was the last time you visited a doctor?',
    subtext: 'Recent medical consultations provide critical proof of ongoing impairment.',
    type: 'single_choice',
    options: [
      { label: 'Within last 12 months', value: 'Within last 12 months' },
      { label: 'More than 12 months ago', value: 'More than 12 months ago' },
      { label: "I haven't had one", value: "I haven't had one" }
    ]
  },

  // Q7: Pending SSD Application (MAJOR FORK)
  {
    id: 'page_igxwft',
    title: 'Do you have a pending application for Social Security Disability (SSD) benefits?',
    subtext: 'Let us know if you already have a filed claim awaiting review or appeal.',
    type: 'single_choice',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' }
    ]
  },

  // Q8 (Branch: if pending app is 'Yes'): Attorney representation
  {
    id: 'attorney',
    title: 'Is an attorney or advocate currently representing you for this SSD application?',
    subtext: 'Helps determine whether you require independent representation or file preparation.',
    type: 'single_choice',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' }
    ]
  },

  // Q8b (Branch: if has attorney): Attorney firm
  {
    id: 'attorneyfirm',
    title: 'Which firm is currently helping you with your disability application?',
    subtext: 'Select your current advocacy group or legal practice.',
    type: 'single_choice',
    options: [
      { label: 'Trajector Disability', value: 'Trajector Disability' },
      { label: 'Premier Disability', value: 'Premier Disability' },
      { label: 'Citizens Disability', value: 'Citizens Disability' },
      { label: 'Nyman Turkish PC', value: 'Nyman Turkish PC' },
      { label: 'Allsup', value: 'Allsup' },
      { label: 'Quikaid', value: 'Quikaid' },
      { label: 'Kirkendall Dwyer LLP', value: 'Kirkendall Dwyer LLP' },
      { label: 'Newlin Disability', value: 'Newlin Disability' },
      { label: 'Other / None of the above', value: 'Other / None of the above' }
    ]
  },

  // Q9: Application denial status
  {
    id: 'page_9rrpa3',
    title: 'Was your Disability application denied?',
    subtext: 'Over 65% of initial Social Security claims are denied on first submission.',
    type: 'single_choice',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' }
    ]
  },

  // Q10: Claim stage / appeal status
  {
    id: 'page_sozf2w',
    title: 'Where are you in the process?',
    subtext: 'Select the exact stage your active appeal or application currently stands.',
    type: 'single_choice',
    options: [
      { label: 'Waiting on first decision', value: 'Waiting on first decision' },
      { label: 'First decision was denied', value: 'First decision was denied' },
      { label: 'I requested reconsideration', value: 'I requested reconsideration' },
      { label: 'I requested a hearing', value: 'I requested a hearing' }
    ]
  },

  // Q10c: Reconsideration status
  {
    id: 'page_reconstatus',
    title: "What's the status of your reconsideration?",
    subtext: 'Reconsideration is the first stage of the formal SSA appeals process.',
    type: 'single_choice',
    options: [
      { label: 'Got denied', value: 'Got denied' },
      { label: 'Pending', value: 'Pending' }
    ]
  },

  // Q10b: Denial age
  {
    id: 'page_denialage',
    title: 'About how long ago did you get the denial?',
    subtext: 'SSA appeals must typically be filed within 60 days of receiving a denial notice.',
    type: 'single_choice',
    options: [
      { label: 'Less than 45 days ago', value: 'Less than 45 days ago' },
      { label: 'More than 45 days ago', value: 'More than 45 days ago' }
    ]
  },

  // Q11: Hearing status
  {
    id: 'page_doic6e',
    title: "What's the current status of your hearing?",
    subtext: 'Hearings are held before an Administrative Law Judge (ALJ).',
    type: 'single_choice',
    options: [
      { label: 'Waiting to be scheduled', value: 'Waiting to be scheduled' },
      { label: 'A hearing is scheduled', value: 'A hearing is scheduled' },
      { label: 'Hearing already happened - waiting on a decision', value: 'Hearing already happened - waiting on a decision' }
    ]
  },

  // Q12: Hearing month
  {
    id: 'page_6dkfid',
    title: 'In which month is your hearing scheduled?',
    subtext: 'Helps prioritize urgent filing preparation before your appearance.',
    type: 'single_choice',
    options: [
      { label: 'May', value: 'May' },
      { label: 'June', value: 'June' },
      { label: 'July', value: 'July' },
      { label: 'August', value: 'August' },
      { label: 'September', value: 'September' },
      { label: 'October', value: 'October' },
      { label: 'November', value: 'November' },
      { label: 'December', value: 'December' },
      { label: 'Next year (2027)', value: 'Next year (2027)' }
    ]
  },

  // Q13: Waiting period
  {
    id: 'page_ddujlp',
    title: "How long you've been waiting ?",
    subtext: 'Current nationwide average wait times range between 6 to 14 months.',
    type: 'single_choice',
    options: [
      { label: 'Less than 3 Months', value: 'Less than 3 Months' },
      { label: '3 – 6 Months', value: '3 – 6 Months' },
      { label: '6 – 9 Months', value: '6 – 9 Months' },
      { label: 'More than 9 Months', value: 'More than 9 Months' }
    ]
  },

  // CONVERGENCE: Demographic questions
  {
    id: 'page_1kwm6b',
    title: 'How do you identify your gender?',
    subtext: 'Used strictly for demographic verification and profile accuracy.',
    type: 'single_choice',
    options: [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
      { label: 'Non - Binary', value: 'Non - Binary' },
      { label: 'Prefer not to respond', value: 'Prefer not to respond' }
    ]
  },

  {
    id: 'page_uhs14w',
    title: 'Please select the option below that represents your age range',
    subtext: 'Age is a key medical-vocational factor evaluated by Social Security examiners.',
    type: 'single_choice',
    options: [
      { label: 'Under 40', value: 'Under 40' },
      { label: '40-49', value: '40-49' },
      { label: '50-54', value: '50-54' },
      { label: '55-63', value: '55-63' },
      { label: '64 or older', value: '64 or older' }
    ]
  },

  {
    id: 'page_8w2qbu',
    title: 'What is your current marital status?',
    subtext: 'Spousal benefits and household thresholds may apply depending on your status.',
    type: 'single_choice',
    options: [
      { label: 'Single', value: 'Single' },
      { label: 'Married', value: 'Married' },
      { label: 'Widowed', value: 'Widowed' },
      { label: 'Divorced', value: 'Divorced' },
      { label: 'Separated (Not receiving support)', value: 'Separated (Not receiving support)' }
    ]
  }
];

/**
 * Question lookup helper
 */
export function getQuestionById(id) {
  return ALL_QUESTIONS.find(q => q.id === id) || null;
}

/**
 * The exact conditional branching table from https://funnel.disabilitypath.org
 * Resolves which question ID to show next given the current question and the user's answer.
 */
export function getNextStepId(currentStepId, selectedAnswer, allAnswers = {}) {
  // Opt-in question routes to receiving benefits
  if (currentStepId === 'is_over_40') {
    return 'receiving_ben';
  }

  // Branch 1: Work hours
  if (currentStepId === 'page_sm72h5') {
    return selectedAnswer === 'Not working' ? 'lastworked' : 'fiveyearwork';
  }

  // Post lastworked -> fiveyearwork
  if (currentStepId === 'lastworked') {
    return 'fiveyearwork';
  }

  // Branch 2: Employment history
  if (currentStepId === 'fiveyearwork') {
    if (selectedAnswer === 'Between 4 and 6 years' || selectedAnswer === 'More than 6 years') {
      return 'outofwork'; // Skips asset test
    }
    return 'page_lyensr'; // Asks asset value
  }

  // Post asset question -> outofwork
  if (currentStepId === 'page_lyensr') {
    return 'outofwork';
  }

  // Branch 3: Out of work duration
  if (currentStepId === 'outofwork') {
    const hoursAnswer = allAnswers['page_sm72h5'];
    if (selectedAnswer === 'Yes' && hoursAnswer === 'Not working') {
      return 'conditionstart';
    }
    return 'visit';
  }

  // Post condition start -> visit
  if (currentStepId === 'conditionstart') {
    return 'visit';
  }

  // Branch 4: Seeing doctor
  if (currentStepId === 'visit') {
    return selectedAnswer === 'Yes' ? 'page_igxwft' : 'page_zbkz5e';
  }

  // Post last doctor visit -> pending app
  if (currentStepId === 'page_zbkz5e') {
    return 'page_igxwft';
  }

  // Branch 5: Pending SSD Application (MAJOR FORK)
  if (currentStepId === 'page_igxwft') {
    // If NO pending app -> jump straight to demographics!
    if (selectedAnswer === 'No') {
      return 'page_1kwm6b'; // Gender
    }
    return 'attorney';
  }

  // Branch 5b: Attorney representation
  if (currentStepId === 'attorney') {
    return selectedAnswer === 'Yes' ? 'attorneyfirm' : 'page_9rrpa3';
  }

  // Post attorney firm -> denial check
  if (currentStepId === 'attorneyfirm') {
    return 'page_9rrpa3';
  }

  // Branch 5c: Denial status
  if (currentStepId === 'page_9rrpa3') {
    return selectedAnswer === 'No' ? 'page_1kwm6b' : 'page_sozf2w';
  }

  // Branch 5d: Process / Claim stage
  if (currentStepId === 'page_sozf2w') {
    if (selectedAnswer === 'Waiting on first decision') return 'page_ddujlp';
    if (selectedAnswer === 'I requested reconsideration') return 'page_reconstatus';
    if (selectedAnswer === 'I requested a hearing') return 'page_doic6e';
    if (selectedAnswer === 'First decision was denied') return 'page_denialage';
    return 'page_1kwm6b';
  }

  // Branch 5e: Reconsideration status
  if (currentStepId === 'page_reconstatus') {
    return selectedAnswer === 'Got denied' ? 'page_denialage' : 'page_ddujlp';
  }

  // Post denial age -> demographic convergence
  if (currentStepId === 'page_denialage') {
    return 'page_1kwm6b';
  }

  // Branch 5f: Hearing status
  if (currentStepId === 'page_doic6e') {
    return selectedAnswer === 'A hearing is scheduled' ? 'page_6dkfid' : 'page_ddujlp';
  }

  // Post hearing month -> waiting period
  if (currentStepId === 'page_6dkfid') {
    return 'page_ddujlp';
  }

  // Post wait period -> demographic convergence
  if (currentStepId === 'page_ddujlp') {
    return 'page_1kwm6b';
  }

  // Convergence: Gender -> Age
  if (currentStepId === 'page_1kwm6b') {
    return 'page_uhs14w';
  }

  // Age -> Marital Status
  if (currentStepId === 'page_uhs14w') {
    return 'page_8w2qbu';
  }

  // Marital Status -> Final calculation & email
  if (currentStepId === 'page_8w2qbu') {
    return 'DONE';
  }

  // Sequential fallback
  const idx = ALL_QUESTIONS.findIndex(q => q.id === currentStepId);
  if (idx !== -1 && idx < ALL_QUESTIONS.length - 1) {
    return ALL_QUESTIONS[idx + 1].id;
  }
  return 'DONE';
}
