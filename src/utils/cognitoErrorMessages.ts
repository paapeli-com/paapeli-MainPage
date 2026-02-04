// Cognito error code mapping to user-friendly messages
export const getCognitoErrorMessage = (error: unknown, language: 'en' | 'ar' | 'fa' = 'en'): string => {
  const errorCode = error?.code || error?.name || '';
  const errorMessage = error?.message || '';

  const errorMessages: Record<string, Record<string, string>> = {
    InvalidPasswordException: {
      en: 'Your password does not meet the required complexity. It must be at least 8 characters with upper/lowercase letters, a number, and a special character.',
      ar: 'كلمة المرور الخاصة بك لا تستوفي التعقيد المطلوب. يجب أن تتكون من 8 أحرف على الأقل مع أحرف كبيرة/صغيرة ورقم وحرف خاص.',
      fa: 'رمز عبور شما پیچیدگی لازم را ندارد. باید حداقل ۸ کاراکتر با حروف بزرگ/کوچک، یک عدد و یک کاراکتر خاص داشته باشد.',
    },
    UserNotFoundException: {
      en: 'No account found with this email address.',
      ar: 'لم يتم العثور على حساب بهذا البريد الإلكتروني.',
      fa: 'هیچ حسابی با این آدرس ایمیل یافت نشد.',
    },
    NotAuthorizedException: {
      en: 'Incorrect email or password. Please try again.',
      ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.',
      fa: 'ایمیل یا رمز عبور نادرست است. لطفاً دوباره تلاش کنید.',
    },
    UsernameExistsException: {
      en: 'An account with this email already exists. Please sign in instead.',
      ar: 'يوجد حساب بهذا البريد الإلكتروني بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.',
      fa: 'حسابی با این ایمیل از قبل وجود دارد. لطفاً وارد شوید.',
    },
    UserNotConfirmedException: {
      en: 'Please verify your email address before signing in.',
      ar: 'يرجى التحقق من عنوان بريدك الإلكتروني قبل تسجيل الدخول.',
      fa: 'لطفاً قبل از ورود، آدرس ایمیل خود را تأیید کنید.',
    },
    CodeMismatchException: {
      en: 'Invalid verification code. Please try again.',
      ar: 'رمز التحقق غير صالح. يرجى المحاولة مرة أخرى.',
      fa: 'کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
    },
    LimitExceededException: {
      en: 'Too many attempts. Please try again later.',
      ar: 'محاولات كثيرة جداً. يرجى المحاولة مرة أخرى لاحقاً.',
      fa: 'تلاش‌های زیادی انجام شده. لطفاً بعداً دوباره تلاش کنید.',
    },
    TooManyRequestsException: {
      en: 'Too many requests. Please wait a moment and try again.',
      ar: 'طلبات كثيرة جداً. يرجى الانتظار لحظة والمحاولة مرة أخرى.',
      fa: 'درخواست‌های زیادی ارسال شده. لطفاً لحظه‌ای صبر کنید و دوباره تلاش کنید.',
    },
    InvalidParameterException: {
      en: 'Invalid input. Please check your information and try again.',
      ar: 'إدخال غير صالح. يرجى التحقق من معلوماتك والمحاولة مرة أخرى.',
      fa: 'ورودی نامعتبر. لطفاً اطلاعات خود را بررسی کرده و دوباره تلاش کنید.',
    },
  };

  // Check for password complexity errors in the message
  if (errorMessage.toLowerCase().includes('password') && 
      (errorMessage.toLowerCase().includes('uppercase') || 
       errorMessage.toLowerCase().includes('lowercase') ||
       errorMessage.toLowerCase().includes('number') ||
       errorMessage.toLowerCase().includes('special'))) {
    return errorMessages.InvalidPasswordException[language];
  }

  // Return mapped error or default message
  if (errorMessages[errorCode]) {
    return errorMessages[errorCode][language];
  }

  // Default fallback messages
  const defaultMessages = {
    en: 'An error occurred. Please try again.',
    ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    fa: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
  };

  return defaultMessages[language];
};
